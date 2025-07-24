const request = require('supertest');
const app = require('./server');

describe('Get/',()=>{
    it("should return Hello World", async ()=>{
         console.log('The imported app object is:', app); 
    const response =  await request(app).get('/');
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe("Hello World");
    })
})