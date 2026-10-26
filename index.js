const sequelize = require('./database');
const { User, Post, Author, Book, Student, Course, Order, Item } = require('./models/index');
const tasks = require('./tasks');

async function seed() {
  await sequelize.sync({ force: true });
  console.log('База данных успешно синхронизирована.');

  const u1 = await User.create({ name: 'Алексей', email: 'alex@test.com', isActive: true });
  const u2 = await User.create({ name: 'Мария', email: 'maria@test.com', isActive: true });
  const u3 = await User.create({ name: 'Дмитрий', email: 'dima@test.com', isActive: false });

  await Post.bulkCreate([
    { title: 'Старый пост', publishedAt: '2022-11-01', status: 'published', authorId: u1.id },
    { title: 'Новый пост', publishedAt: '2024-03-15', status: 'published', authorId: u1.id },
    { title: 'Черновик Марии', publishedAt: '2024-08-22', status: 'draft', authorId: u2.id },
  ]);

  const a1 = await Author.create({ firstName: 'Александр', lastName: 'Пушкин', country: 'Россия' });
  const a2 = await Author.create({ firstName: 'Федор', lastName: 'Достоевский', country: 'Россия' });
  const a3 = await Author.create({ firstName: 'Иван', lastName: 'Тургенев', country: 'Россия' });

  await Book.bulkCreate([
    { title: 'Капитанская дочка', year: 1836, genre: 'Повесть', authorId: a1.id },
    { title: 'Преступление и наказание', year: 1866, genre: 'Роман', authorId: a2.id },
  ]);

  const s1 = await Student.create({ name: 'Игорь', group: 'А-1' });
  const s2 = await Student.create({ name: 'Елена', group: 'Б-2' });

  const c1 = await Course.create({ title: 'Высшая математика', credits: 5 });
  const c2 = await Course.create({ title: 'История', credits: 2 });

  await s1.addCourse(c1, { through: { grade: 5 } });
  await s2.addCourse(c2, { through: { grade: 4 } });

  const o1 = await Order.create({ number: 'ORD-101', status: 'new' });
  const o2 = await Order.create({ number: 'ORD-102', status: 'paid' });

  await Item.bulkCreate([
    { productName: 'Ноутбук', quantity: 1, price: 75000.00, orderId: o1.id },
    { productName: 'Мышка', quantity: 3, price: 1500.00, orderId: o1.id },
    { productName: 'Кабель', quantity: 5, price: 500.00, orderId: o2.id },
  ]);

  console.log('Тестовые данные успешно загружены.\n');
}

async function run() {
  try {
    await seed();

    console.log('РЕЗУЛЬТАТ ЗАДАНИЯ 1');
    console.log(JSON.stringify(await tasks.getUsersWithRecentPosts(), null, 2));

    console.log('\nРЕЗУЛЬТАТ ЗАДАНИЯ 2');
    console.log(JSON.stringify(await tasks.getAllAuthorsIncludingEmpty(), null, 2));

    console.log('\nРЕЗУЛЬТАТ ЗАДАНИЯ 3');
    console.log(JSON.stringify(await tasks.getStudentsInAdvancedCourses(), null, 2));

    console.log('\nРЕЗУЛЬТАТ ЗАДАНИЯ 4');
    console.log(JSON.stringify(await tasks.getOrdersWithBulkItems(), null, 2));

    console.log('\nРЕЗУЛЬТАТ ЗАДАНИЯ 5');
    console.log(JSON.stringify(await tasks.getActiveUsersWithPublishedPosts(), null, 2));

  } catch (error) {
    console.error('Ошибка:', error);
  } finally {
    await sequelize.close();
  }
}

run();
