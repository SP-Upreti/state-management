const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 200]
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: {
            isDecimal: true,
            min: 0.01
        }
    },
    discountPercentage: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 100
        }
    },
    rating: {
        type: DataTypes.DECIMAL(3, 2),
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 5
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
            min: 0
        }
    },
    brand: {
        type: DataTypes.STRING(100),
        allowNull: true
    },
    sku: {
        type: DataTypes.STRING(50),
        allowNull: true,
        unique: true
    },
    thumbnail: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    weight: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true
    },
    dimensions: {
        type: DataTypes.JSON,
        allowNull: true
    },
    warrantyInformation: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    shippingInformation: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    availabilityStatus: {
        type: DataTypes.ENUM('In Stock', 'Low Stock', 'Out of Stock'),
        allowNull: false,
        defaultValue: 'In Stock'
    },
    returnPolicy: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    minimumOrderQuantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
    },
    tags: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: []
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
    },
    isFeatured: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },
    views: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: 'products',
    indexes: [
        {
            fields: ['categoryId']
        },
        {
            fields: ['brand']
        },
        {
            fields: ['price']
        },
        {
            fields: ['rating']
        },
        {
            fields: ['isActive']
        },
        {
            fields: ['isFeatured']
        },
        {
            unique: true,
            fields: ['sku']
        }
    ]
});

module.exports = Product;