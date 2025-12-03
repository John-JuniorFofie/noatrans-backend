import swaggerJSDoc from "swagger-jsdoc";

const options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "noatrans website API Documentation",
            version: "1.0.0",
            description: "This is the backend API documentation for Ghanaian Language facilitation platform, built with Node.js, Express, and MongoDB.",
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
                url: "https://noatrans-backend.onrender.com/",
                description: "onrender.com",
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