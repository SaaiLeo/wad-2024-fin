export default async function CustomerDetail({ params }) {
    const APIBASE = process.env.NEXT_PUBLIC_API_BASE;
  
    // Fetch customer data based on the dynamic id from the URL
    const data = await fetch(`${APIBASE}/customer/${params.id}`)
    const customer = await data.json();
  
    console.log({ customer });  // Log customer data for debugging
  
    // Return the JSX to display customer details
    return (
      <div className="m-4">
        <h1>Customer</h1>
        <p className="font-bold text-xl text-blue-800">Name: {customer.name}</p>
        <p>Date of Birth: {customer.dateOfBirth}</p>
        <p>Member Number: {customer.memberNumber}</p>
        <p>Interests: {customer.interests}</p>
      </div>
    );
  }
  