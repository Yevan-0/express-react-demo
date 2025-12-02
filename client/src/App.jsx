import { useEffect, useState } from "react"

const baseURL = import.meta.env.VITE_API_BASE_URL

export default function App() {
  const [keyword, setKeyword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityData, setCityData] = useState([]);


  // Load drop down
  useEffect(() => {
    const loadProvinces = async () => {
      const resp = await fetch(`${baseURL}sl-postal-codes/provinces?keyword=${keyword}`);
      const data = await resp.json();
      setProvinces(data);
    }
    loadProvinces();
  }, [])

  // Load cities on drop down click
  const loadCities = async (provinceName) => {
    const resp = await fetch(`${baseURL}sl-postal-codes/cities?keyword=${provinceName}`);
    const data = await resp.json();
    setCities(data);
    setCityData([])
  }

  // Search for city on the button click
  const loadAllData = async () => {
    const resp = await fetch(`${baseURL}sl-postal-codes/cities/search?keyword=${searchWord}`);
    const data = await resp.json();
    setCityData(data);
    setCities([])
  }

  return (
    <div>

      <div style={{ gap: "10px", display: "flex" }}>

        <select
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        >
          {provinces.map((province, i) => (
            <option
              key={province.id}
              value={province.name}
            >
              {province.name}
            </option>
          ))}
        </select>

        <button
          onClick={() => loadCities(keyword)}
        >
          Load Cities
        </button>

        <input
          type="text"
          value={searchWord}
          onChange={(e) => setSearchWord(e.target.value)}
          placeholder="Enter city"
        />

        <button
          onClick={loadAllData}
        >
          Search
        </button>
      </div>

      <ul>
        {cities.map((item) => (
          <li key={item.id}>
            {item.city} - {item.code}
          </li>
        ))}
      </ul>

      <ul>
        {cityData.map((item) => (
          <li key={item.id}>
            {item.city} - {item.code} ({item.province})
          </li>
        ))}
      </ul>

    </div>
  )
}