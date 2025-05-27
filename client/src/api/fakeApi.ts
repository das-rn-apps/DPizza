// src/api/fakeApi.ts

import type { Pizza, User, Order, CartItem } from "./types";

// --- Dummy Data ---
const PIZZAS: Pizza[] = [
  {
    id: "pizza-1",
    name: "Margherita",
    description: "Classic cheese and tomato pizza.",
    image: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg",
    price: 12.99,
    category: "Vegetarian",
    toppings: ["Mozzarella", "Tomato Sauce", "Basil"],
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: "pizza-2",
    name: "Pepperoni",
    description: "A classic with generous pepperoni slices.",
    image: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg",
    price: 14.5,
    category: "Non-Vegetarian",
    toppings: ["Mozzarella", "Tomato Sauce", "Pepperoni"],
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: "pizza-3",
    name: "Veggie Supreme",
    description: "Loaded with fresh vegetables and olives.",
    image: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg",
    price: 13.75,
    category: "Vegetarian",
    toppings: [
      "Mozzarella",
      "Tomato Sauce",
      "Onions",
      "Bell Peppers",
      "Mushrooms",
      "Olives",
    ],
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: "pizza-4",
    name: "Chicken Tikka",
    description: "Spicy chicken tikka chunks with onions and capsicum.",
    image: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg",
    price: 15.99,
    category: "Non-Vegetarian",
    toppings: [
      "Mozzarella",
      "Tikka Sauce",
      "Chicken Tikka",
      "Onions",
      "Capsicum",
    ],
    sizes: ["Small", "Medium", "Large"],
  },
  {
    id: "pizza-5",
    name: "BBQ Chicken",
    description: "Tangy BBQ sauce, grilled chicken, and red onions.",
    image: "https://images.pexels.com/photos/1435907/pexels-photo-1435907.jpeg",
    price: 15.5,
    category: "Non-Vegetarian",
    toppings: ["Mozzarella", "BBQ Sauce", "Grilled Chicken", "Red Onions"],
    sizes: ["Small", "Medium", "Large"],
  },
];

let users: User[] = []; // In a real app, this would be persisted
let orders: Order[] = []; // In a real app, this would be persisted

// --- API Functions ---

export const fetchPizzas = async (query?: string): Promise<Pizza[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredPizzas = PIZZAS;
      if (query) {
        const lowerCaseQuery = query.toLowerCase();
        filteredPizzas = PIZZAS.filter(
          (pizza) =>
            pizza.name.toLowerCase().includes(lowerCaseQuery) ||
            pizza.description.toLowerCase().includes(lowerCaseQuery) ||
            pizza.category.toLowerCase().includes(lowerCaseQuery) ||
            pizza.toppings.some((topping) =>
              topping.toLowerCase().includes(lowerCaseQuery)
            )
        );
      }
      resolve(filteredPizzas);
    }, 500); // Simulate network delay
  });
};

export const fetchPizzaById = async (
  id: string
): Promise<Pizza | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pizza = PIZZAS.find((p) => p.id === id);
      resolve(pizza);
    }, 300);
  });
};

export const placeOrder = async (
  cartItems: CartItem[],
  userId: string | null
): Promise<Order> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!cartItems || cartItems.length === 0) {
        reject(new Error("Cannot place an empty order."));
        return;
      }

      const newOrder: Order = {
        id: `order-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        userId: userId,
        items: cartItems,
        totalAmount: cartItems.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        ),
        status: "Pending",
        orderDate: new Date().toISOString(),
      };
      orders.push(newOrder);
      resolve(newOrder);
    }, 1000);
  });
};

export const loginUser = async (
  credentials: Pick<User, "email" | "password">
): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(
        (u) =>
          u.email === credentials.email && u.password === credentials.password
      );
      if (user) {
        resolve({ ...user, token: `fake-jwt-token-${user.id}` }); // Simulate token
      } else {
        reject(new Error("Invalid credentials"));
      }
    }, 500);
  });
};

export const registerUser = async (
  userData: Omit<User, "id" | "token">
): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (users.some((u) => u.email === userData.email)) {
        reject(new Error("User with this email already exists."));
      } else {
        const newUser: User = {
          id: `user-${Date.now()}`,
          token: `fake-jwt-token-${Date.now()}`,
          ...userData,
        };
        users.push(newUser);
        resolve(newUser);
      }
    }, 500);
  });
};

// Simulate initial user for testing login
if (users.length === 0) {
  users.push({
    id: "user-test-1",
    name: "Test User",
    email: "test@example.com",
    password: "password123",
    token: "fake-jwt-token-test-1",
  });
}

// src/api/fakeApi.ts

// ... (existing imports and dummy data: PIZZAS, users, orders) ...

// --- API Functions ---

// ... (existing fetchPizzas, fetchPizzaById, placeOrder, loginUser, registerUser) ...

export const fetchOrdersByUserId = async (userId: string): Promise<Order[]> => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      const userOrders = orders.filter((order) => order.userId === userId);
      if (userOrders.length > 0) {
        resolve(
          userOrders.sort(
            (a, b) =>
              new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
          )
        ); // Sort by newest
      } else {
        // Return empty array if no orders, don't reject
        resolve([]);
      }
    }, 800); // Simulate network delay
  });
};

export const fetchOrderById = async (
  orderId: string,
  userId?: string | null
): Promise<Order | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let order = orders.find((o) => o.id === orderId);
      // In a real app, you'd also check if the user is authorized to view this order
      if (order && userId && order.userId !== userId) {
        order = undefined; // Deny access if not the owner
      }
      resolve(order);
    }, 600);
  });
};

// ... (rest of the file) ...
