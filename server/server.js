import express from "express"
import cors from "cors"
import fs from "fs"

// Parse and read json file
const codes = JSON.parse(fs.readFileSync("datasets/sl-postal-codes.json"));

// create express app
const app = express();

// set cors for front-end domain
app.use(cors());

// enabele json middleware
app.use(express.json());

// get province request
app.get('/api/sl-postal-codes/provinces', (req, res) => {
    const keyword = (req.query.keyword || "").toLowerCase();

    const provinces = codes
        .filter(province =>
            province.name.toLowerCase().includes(keyword)
        )
        .map(item => ({
            id: item.id,
            name: item.name
        }))

    res.send(provinces)
});

// GET cities
app.get('/api/sl-postal-codes/cities', (req, res) => {
    const keyword = req.query.keyword?.toLowerCase();

    const province = codes
        .find(province =>
            province.name.toLowerCase().includes(keyword)
        )

    if (!province) {
        return res.json([]);
    }

    const result = (province.cities || []).map(city => ({
        id: city.code,
        city: city.name,
        code: city.code,
        province: province.name
    }));

    res.send(result);
});

// GET cities to search
app.get('/api/sl-postal-codes/cities/search', (req, res) => {
    const keyword = req.query.keyword?.toLowerCase();;
    const result = [];

    codes.forEach(province => {
        province.cities.forEach(city => {
            if (city.name.toLowerCase().includes(keyword)) {
                result.push({
                    id: city.code,
                    city: city.name,
                    code: city.code,
                    province: province.name
                });
            }
        });
    });

    res.json(result)
})

// start server on the port
app.listen(3001, () => {
    console.log("Sever started! @http//:localhost:3001")
});