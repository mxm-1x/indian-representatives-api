const { useState } = React;

function Card({ name, designation, phone, email }) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
      <h3 className="text-xl font-semibold mb-2">{name}</h3>
      <p className="text-gray-600 mb-2">{designation}</p>
      <p className="text-gray-600 mb-1">
        <span className="font-semibold">Phone:</span> {phone}
      </p>
      <p className="text-gray-600">
        <span className="font-semibold">Email:</span> {email}
      </p>
    </div>
  );
}

function App() {
  const [locality, setLocality] = useState('');
  const [representatives, setRepresentatives] = useState([]);
  const [formData, setFormData] = useState({
    locality: '',
    name: '',
    designation: '',
    phone: '',
    email: '',
  });
  const [message, setMessage] = useState('');

  const handleGetRepresentatives = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/representatives/${locality}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRepresentatives(data);
      setMessage('');
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setRepresentatives([]);
    }
  };

  const handleUpdateRepresentative = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/update-representative', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMessage(data.message);
      setFormData({
        locality: '',
        name: '',
        designation: '',
        phone: '',
        email: '',
      });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Indian Representatives API</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Get Representatives</h2>
          <form onSubmit={handleGetRepresentatives} className="mb-8">
            <div className="mb-4">
              <label htmlFor="getLocality" className="block text-gray-700 font-bold mb-2">
                Locality:
              </label>
              <input
                type="text"
                id="getLocality"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Get Representatives
            </button>
          </form>

          <div className="grid gap-4">
            {representatives.map((rep, index) => (
              <Card key={index} {...rep} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Update Representative</h2>
          <form onSubmit={handleUpdateRepresentative} className="mb-8">
            {['locality', 'name', 'designation', 'phone', 'email'].map((field) => (
              <div key={field} className="mb-4">
                <label htmlFor={field} className="block text-gray-700 font-bold mb-2">
                  {field.charAt(0).toUpperCase() + field.slice(1)}:
                </label>
                <input
                  type={field === 'email' ? 'email' : 'text'}
                  id={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required={field === 'locality' || field === 'name'}
                />
              </div>
            ))}
            <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Update Representative
            </button>
          </form>
        </div>
      </div>

      {message && (
        <div className="mt-8 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
          <p>{message}</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

