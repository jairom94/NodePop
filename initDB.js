import connectMongoose from './lib/connectMongoose.js';
import User from './models/User.js';
import Tag from './models/Tag.js';
import Product from './models/Product.js';


const connection = await connectMongoose();
console.log('Connected to MongoDB:', connection.name);

const initUsers = async () => {
    const usersDeleted = await User.deleteMany();
    console.log(`Deleted ${usersDeleted.deletedCount} users.`)
    const insertUsers = await User.insertMany([
        {
            name: 'Jairo',
            lastname_1: 'Moreno',
            email: 'jairo@mail.com',
            password: await User.hashPassword('1234')
        },
        {
            name: 'José',
            lastname_1: 'Padilla',
            email: 'jose@mail.com',
            password: await User.hashPassword('1234')
        }
    ]);
    console.log(`Inserted ${insertUsers.length} users.`)
}
const initTags = async () => {
    const tagsDeleted = await Tag.deleteMany();
    console.log(`Deleted ${tagsDeleted.deletedCount} tags.`)
    const insertTags = await Tag.insertMany([
        {
            name: 'work',
        },
        {
            name: 'lifestyle',
        },
        {
            name: 'motor',
        },
        {
            name: 'mobile',
        }
    ]);
    console.log(`Inserted ${insertTags.length} tags.`)
}

const initProducts = async () => {
    const productsDeleted = await Product.deleteMany();
    console.log(`Deleted ${productsDeleted.deletedCount} products.`)
    const [user1, user2] = await Promise.all([
        User.findOne({ email: 'jairo@mail.com' }),
        User.findOne({ email: 'jose@mail.com' })
    ])
    const tags = await Tag.find()
    const getTagID = (name = '') => {
        return tags.find(t => t.name === name)?._id
    }
    const insertProducts = await Product.insertMany([
        {
            name: "Laptop Pro",
            price: 1500,
            owner: user1._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('work'),
                getTagID('mobile')
            ]
        },
        {
            name: "Smartphone X",
            price: 800,
            owner: user1._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('mobile'),
                getTagID('lifestyle')
            ]
        },
        {
            name: "Tablet S",
            price: 600,
            owner: user1._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('mobile'),
                getTagID('work')
            ]
        },
        {
            name: "Monitor HD",
            price: 350,
            owner: user1._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('work'),
                getTagID('lifestyle')
            ]
        },
        {
            name: "Smartwatch Z",
            price: 250,
            owner: user1._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('mobile'),
                getTagID('lifestyle')
            ]
        },
        {
            name: "Auriculares Pro",
            price: 150,
            owner: user2._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('lifestyle'),
                getTagID('mobile')
            ]
        },
        {
            name: "Teclado Mecánico",
            price: 120,
            owner: user2._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('work')
            ]
        },
        {
            name: "Cámara Digital",
            price: 900,
            owner: user2._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('lifestyle'),
                getTagID('mobile')
            ]
        },
        {
            name: "Drone Explorer",
            price: 1100,
            owner: user2._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('motor'),
                getTagID('lifestyle')
            ]
        },
        {
            name: "Bicicleta Eléctrica",
            price: 1800,
            owner: user2._id,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 99) + 1}/600/400`,
            tags: [
                getTagID('motor'),
                getTagID('lifestyle')
            ]
        }
    ]);
    console.log(`Inserted ${insertProducts.length} products.`)
}


await initUsers();
await initTags();
await initProducts();

await connection.close();