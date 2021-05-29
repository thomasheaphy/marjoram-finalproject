const spicedPg = require("spiced-pg");
const db = spicedPg("postgres:postgres:postgres@localhost:5432/imageboard");

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

module.exports.addImages = (title, description, url, category) => {
    return db.query(
        `
    INSERT INTO images (title, description, url, category)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [title, description, username, url]
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

