// ingest-sources.js
// Run with: NODE_ENV=production node ingest-sources.js
const axios = require('axios');
const { createClient } = require('@supabase/supabase-js');
const parse = require('csv-parse/lib/sync');
const { XMLParser } = require('fast-xml-parser');
const dayjs = require('dayjs');
const _ = require('lodash');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY; // server key
if(!SUPABASE_URL || !SUPABASE_SERVICE_KEY) throw new Error('Missing Supabase env vars');

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { persistSession: false }
});

// --- CONFIG: approved sources (replace with real approved sources) ---
const SOURCES = [
  // Example entries. Replace with real approved sources + credentials.
  // { id: 'fastweb', type: 'api', url: 'https://api.fastweb.com/scholarships', apiKey: process.env.FASTWEB_API_KEY },
  // { id: 'scholarships_com', type: 'rss', url: 'https://www.scholarships.com/rss/scholarships.xml' },
  // { id: 'college_board', type: 'csv', url: 'https://bigfuture.collegeboard.org/scholarships/export.csv' },
  
  // Sample source for testing - replace with real sources
  {
    id: 'sample_provider',
    type: 'api',
    url: 'https://jsonplaceholder.typicode.com/posts', // Mock API for testing
    transform: (items) => items.slice(0, 5).map((item, index) => ({
      id: `sample_${item.id}`,
      name: `Sample Scholarship ${item.id}`,
      amount: `$${(index + 1) * 1000}`,
      eligibility: item.body.substring(0, 100),
      deadline: dayjs().add(Math.floor(Math.random() * 365), 'days').format('YYYY-MM-DD'),
      link: `https://example.com/scholarship/${item.id}`,
      category: ['STEM', 'Arts', 'General', 'Leadership'][index % 4],
      region: 'National'
    }))
  }
];

// Normalize function: transform provider record into our canonical object
function normalize(providerId, item) {
  // Implement provider-specific mappings. Use best-effort mapping rules:
  return {
    source: providerId,
    source_id: item.id || item.awardId || item.guid || null,
    name: item.name || item.title || item['scholarship_name'] || null,
    amount: item.amount || item.award || item['amount'] || 'See provider',
    eligibility: item.eligibility || item.requirements || item.description || null,
    deadline: item.deadline ? dayjs(item.deadline).format('YYYY-MM-DD') : (item.date ? dayjs(item.date).format('YYYY-MM-DD') : null),
    link: item.link || item.url || item.apply_link || null,
    region: item.region || item.country || 'National',
    category: item.category || item.field || 'General',
    raw_json: item
  };
}

async function checkLink(url) {
  try {
    if(!url) return { ok: false, status: null };
    const res = await axios.head(url, { timeout: 8000, maxRedirects: 5 });
    return { ok: res.status >= 200 && res.status < 400, status: res.status };
  } catch (e) {
    return { ok: false, status: e.response ? e.response.status : null };
  }
}

async function upsertScholarship(obj) {
  // Dedupe strategy: by source + source_id OR normalized name + link
  const { source, source_id, name, link } = obj;
  let existing = null;
  
  if (source && source_id) {
    const { data } = await supabase
      .from('scholarships')
      .select('id')
      .eq('source', source)
      .eq('source_id', source_id)
      .limit(1);
    existing = data && data[0];
  }
  
  if (!existing && link) {
    const { data } = await supabase
      .from('scholarships')
      .select('id, link')
      .ilike('link', `%${link.split('/').slice(0,3).join('/')}%`)
      .limit(1);
    existing = data && data[0];
  }
  
  // If still not found, try fuzzy on name
  if (!existing && name) {
    const { data } = await supabase
      .from('scholarships')
      .select('id, name')
      .ilike('name', `%${name.slice(0,40)}%`)
      .limit(1);
    existing = data && data[0];
  }

  const linkCheck = await checkLink(obj.link);
  const payload = {
    ...obj,
    last_checked: new Date().toISOString(),
    last_updated: new Date().toISOString(),
    link_broken: !linkCheck.ok,
    expired: obj.deadline ? (dayjs().isAfter(dayjs(obj.deadline))) : false
  };

  if (existing && existing.id) {
    const { error } = await supabase.from('scholarships').update(payload).eq('id', existing.id);
    if (error) throw error;
    return { action: 'updated', id: existing.id };
  } else {
    const { data, error } = await supabase.from('scholarships').insert(payload).select('id');
    if (error) throw error;
    return { action: 'inserted', id: data[0].id };
  }
}

async function fetchCSV(source) {
  const res = await axios.get(source.url, { responseType: 'text', timeout: 20000 });
  const rows = parse(res.data, { columns: true, skip_empty_lines: true });
  return rows;
}

async function fetchRSS(source) {
  const res = await axios.get(source.url, { responseType: 'text', timeout: 20000 });
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(res.data);
  // RSS -> extract items
  const items = (parsed.rss && parsed.rss.channel && parsed.rss.channel.item) || parsed.feed?.entry || [];
  return items;
}

async function fetchAPI(source) {
  const headers = source.apiKey ? { Authorization: `Bearer ${source.apiKey}` } : {};
  const res = await axios.get(source.url, { headers, timeout: 20000 });
  let data = res.data;
  
  // Apply custom transform if provided
  if (source.transform && typeof source.transform === 'function') {
    data = source.transform(data);
  }
  
  return data;
}

async function logReport(source, status, message, stats = {}) {
  await supabase.from('ingest_reports').insert({
    source: source,
    status: status,
    message: message,
    items_processed: stats.processed || 0,
    items_added: stats.added || 0,
    items_updated: stats.updated || 0,
    items_flagged: stats.flagged || 0,
    error: stats.error || null,
    occurred_at: new Date().toISOString()
  });
}

async function run() {
  console.log('Starting ingestion run with', SOURCES.length, 'sources');
  let totalStats = { processed: 0, added: 0, updated: 0, flagged: 0, errors: 0 };
  
  for (const source of SOURCES) {
    let sourceStats = { processed: 0, added: 0, updated: 0, flagged: 0 };
    
    try {
      let items = [];
      if (source.type === 'csv') items = await fetchCSV(source);
      else if (source.type === 'rss') items = await fetchRSS(source);
      else if (source.type === 'api') items = await fetchAPI(source);
      else continue;

      sourceStats.processed = items.length;

      // For each item, normalize and upsert
      for (const it of items) {
        try {
          const norm = normalize(source.id, it);
          if (!norm.name || !norm.link) {
            norm.needs_review = true;
            sourceStats.flagged++;
          }
          
          const result = await upsertScholarship(norm);
          if (result.action === 'inserted') sourceStats.added++;
          else if (result.action === 'updated') sourceStats.updated++;
          
        } catch (itemError) {
          console.error(`Error processing item from ${source.id}:`, itemError.message);
          sourceStats.flagged++;
        }
      }
      
      console.log(`Ingested from ${source.id}: ${sourceStats.processed} processed, ${sourceStats.added} added, ${sourceStats.updated} updated, ${sourceStats.flagged} flagged`);
      
      await logReport(source.id, 'success', `Successfully processed ${sourceStats.processed} items`, sourceStats);
      
      // Update totals
      totalStats.processed += sourceStats.processed;
      totalStats.added += sourceStats.added;
      totalStats.updated += sourceStats.updated;
      totalStats.flagged += sourceStats.flagged;
      
    } catch (err) {
      console.error('Source failed', source.id, err.message || err);
      totalStats.errors++;
      
      await logReport(source.id, 'error', `Source ingestion failed: ${err.message}`, {
        error: (err.message || JSON.stringify(err)).slice(0,4000)
      });
    }
  }
  
  console.log('Ingestion run complete. Total stats:', totalStats);
  
  // Send summary email if SendGrid is configured
  if (process.env.SENDGRID_API_KEY) {
    await sendSummaryEmail(totalStats);
  }
}

async function sendSummaryEmail(stats) {
  try {
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    
    const msg = {
      to: process.env.ADMIN_EMAIL || 'admin@globalpathways.org',
      from: process.env.FROM_EMAIL || 'noreply@globalpathways.org',
      subject: 'Daily Scholarship Ingestion Report',
      html: `
        <h2>Scholarship Ingestion Summary</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        <ul>
          <li>Total Processed: ${stats.processed}</li>
          <li>New Scholarships Added: ${stats.added}</li>
          <li>Existing Updated: ${stats.updated}</li>
          <li>Flagged for Review: ${stats.flagged}</li>
          <li>Source Errors: ${stats.errors}</li>
        </ul>
        <p>Check the admin panel for detailed reports and moderation.</p>
      `
    };
    
    await sgMail.send(msg);
    console.log('Summary email sent successfully');
  } catch (error) {
    console.error('Failed to send summary email:', error.message);
  }
}

run().catch(err => {
  console.error('Fatal ingestion error', err);
  process.exit(1);
});