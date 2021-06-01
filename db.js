const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/thomasheaphy");

// LOGIN

module.exports.getUser = (username) => {
    const q = `
    SELECT * 
    FROM users
    WHERE username = $1
    `;

    const params = [username];
    return db.query(q, params);
};

// Images

module.exports.getImages = () => {
    return db.query(
        `
    SELECT * 
    FROM images
    ORDER BY id DESC 
    `
    );
};

module.exports.addImages = (title, description, category, path) => {
    return db.query(
        `
    INSERT INTO images (title, description, category, path)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [title, description, path, category]
    );
};

module.exports.selectImage = (imageId) => {
    return db.query(
        `
    SELECT * FROM images
    WHERE id = $1
    `,
        [imageId]
    );
};

module.exports.selectCategory = (category) => {
    return db.query(
        `
        SELECT * FROM images
        WHERE category = $1
        `,
        [category]
    );
};
