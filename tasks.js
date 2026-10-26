const { Op } = require('sequelize');
const { User, Post, Author, Book, Student, Course, Order, Item } = require('./models/index');

async function getUsersWithRecentPosts() {
  return User.findAll({
    include: [{
      model: Post,
      as: 'posts',
      where: { publishedAt: { [Op.gt]: '2023-01-01' } },
      required: true,
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Post, as: 'posts' }, 'publishedAt', 'DESC']
    ],
  });
}

async function getAllAuthorsIncludingEmpty() {
  return Author.findAll({
    include: [{
      model: Book,
      as: 'books',
      required: false,
    }],
    order: [['lastName', 'ASC']],
  });
}

async function getStudentsInAdvancedCourses() {
  return Student.findAll({
    include: [{
      model: Course,
      as: 'courses',
      where: { credits: { [Op.gt]: 3 } },
      required: true,
      through: { attributes: [] }
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Course, as: 'courses' }, 'title', 'ASC']
    ],
  });
}

async function getOrdersWithBulkItems() {
  return Order.findAll({
    include: [{
      model: Item,
      as: 'items',
      where: { quantity: { [Op.gt]: 2 } },
      required: true,
    }],
    order: [
      ['createdAt', 'DESC'],
      [{ model: Item, as: 'items' }, 'price', 'DESC']
    ],
  });
}

async function getActiveUsersWithPublishedPosts() {
  return User.findAll({
    where: { isActive: true },
    include: [{
      model: Post,
      as: 'posts',
      where: { status: 'published' },
      required: true,
    }],
    order: [
      ['name', 'ASC'],
      [{ model: Post, as: 'posts' }, 'createdAt', 'DESC']
    ],
  });
}

module.exports = {
  getUsersWithRecentPosts,
  getAllAuthorsIncludingEmpty,
  getStudentsInAdvancedCourses,
  getOrdersWithBulkItems,
  getActiveUsersWithPublishedPosts
};
