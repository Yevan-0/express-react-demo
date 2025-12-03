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

// get province request => gets the province names and the ids
app.get('/api/sl-postal-codes/provinces', (_, res) => {
    const provinces = codes.map(({ id, name }) => ({ id, name }));
    res.send(provinces)
});


// GET cities => maps the selected province id and gets the all the cities in that province 
app.get('/api/sl-postal-codes/cities/province/:id', (req, res) => {

    const PRO_ID = req.params.id;

    const province = codes.find(prov => prov.id === PRO_ID);


    if (!province) {
        return res.json([]);
    }

    const result = (province.cities || []).map(city => ({
        id: city.code,
        city: city.name,
        code: city.code,
        province: province.id
    }));

    res.send(result);
});


// GET cities to search => enter searchKeyword, then maps through the api and gets the city, code, provinceID and provinceName 
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