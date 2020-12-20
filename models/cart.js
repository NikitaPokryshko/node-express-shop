const path = require('path')
const fs = require('fs');

const CART_PATH = path.join(
  path.dirname(require.main.filename),
  'data',
  'cart.json'
);

class Cart {
  static async add(course) {
    const cart = await Cart.fetch();

    const index = cart.courses.findIndex(c => c.id === course.id);
    const candidate = cart.courses[index];

    if (candidate) {
      // course exists
      candidate.count++;
      cart.courses[index] = candidate;
    } else {
      // add course
      course.count = 1;
      cart.courses.push(course);
    }

    cart.price += Number(course.price);

    return new Promise((resolve, reject) => {
      fs.writeFile(CART_PATH, JSON.stringify(cart), err => {
        err ? reject(err) : resolve();
      })
    })
  }

  static async remove(id) {
    const cart = await Cart.fetch();

    const index = cart.courses.findIndex(c => c.id === id);
    const course = cart.courses[index];

    if (course.count === 1) {
      // delete course
      cart.courses = cart.courses.filter(c => c.id !== id);
    } else {
      cart.courses[index].count--;
      // change count
    }

    cart.price -= course.price;

    return new Promise((resolve, reject) => {
      fs.writeFile(CART_PATH, JSON.stringify(cart), err => {
        err ? reject(err) : resolve(cart);
      })
    })
  }

  static async fetch() {
    return new Promise((resolve, reject) => {
      fs.readFile(CART_PATH, 'utf-8', (err, content) => {
        err ? reject(err) : resolve(JSON.parse(content));
      });
    });   
  }
}

module.exports = Cart;
