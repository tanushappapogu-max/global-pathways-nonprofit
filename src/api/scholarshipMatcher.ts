export async function matchScholarships(formData: any) {
  try {
    const response = await fetch('/api/scholarships', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});


    const data = await response.json();
    return data.scholarships || [];
  } catch (error) {
    console.error('Error calling API:', error);
    return [];
  }
}