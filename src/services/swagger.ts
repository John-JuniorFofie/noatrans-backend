import swaggerJSDoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "noatrans website API Documentation",
            version: "1.0.0",
            description: "This is the backend API documentation for the ride hailing system, built with Node.js, Express, and MongoDB.",
        },
        contact: {
            name: "John Fofie Junior",
            title: "Project Maintainer: Aspiring Backend Engineer",
            url: "https://new-portfolio-liart-two.vercel.app/",
            email: "johnfofie31@gmail.com",
        },
        // license: {
        //     name: "MIT License",
        //     url: "",
        // },
        servers: [
           
            {
                url: "http://localhost:5000/",
                description: "local host",
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["src/routes/*.ts"],
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;