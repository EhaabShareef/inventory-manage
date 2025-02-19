# Inventory Management System

## Table of Contents
1. [Introduction](#introduction)
2. [Features](#features)
3. [Project Structure](#project-structure)
4. [Setup](#setup)
5. [Authentication](#authentication)
6. [User Management](#user-management)
7. [Category Management](#category-management)
8. [Item Management](#item-management)
9. [Dashboard](#dashboard)
10. [Audit Logging](#audit-logging)
11. [API Routes](#api-routes)
12. [Database Schema](#database-schema)
13. [Styling](#styling)
14. [Deployment](#deployment)

## Introduction

This Inventory Management System is a web-based application built with Next.js, React, and Prisma. It provides functionality for managing users, categories, and inventory items, along with a dashboard for quick insights and audit logging for tracking system activities.

## Features

- User authentication (login/logout)
- User registration and management (create, update, delete)
- Category management (create, read, update, delete)
- Item management (create, read, update, delete)
- Dashboard with key statistics
- Audit logging for system activities
- Role-based access control (View and Manage roles)

# Project Directory Structure

```
/
├── actions/
│   ├── auth.ts
│   ├── category.ts
│   ├── dashboard.ts
│   ├── item.ts
│   └── user.ts
├── app/
│   ├── admin/
│   │   ├── category/
│   │   ├── dashboard/
│   │   ├── item/
│   │   └── user/
│   ├── api/
│   ├── login/
│   └── register/
├── components/
│   ├── ui/
│   ├── category/
│   ├── item/
│   └── user/
├── lib/
│   ├── auth.ts
│   ├── prisma.ts
│   └── utils.ts
├── types/
│   ├── inventory.ts
│   └── user.ts
├── prisma/
│   └── schema.prisma
├── public/
├── .env
├── middleware.ts
├── next.config.js
├── package.json
└── tsconfig.json
```


## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up your PostgreSQL database
4. Create a `.env` file with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"
JWT_SECRET="your_secret_key"
```
5. Run Prisma migrations: `npx prisma migrate dev`
6. Start the development server: `npm run dev`

## Authentication

Authentication is handled using JWT (JSON Web Tokens). The `auth.ts` file in the `actions` folder contains the following functions:

- `login(formData: FormData)`: Authenticates a user and sets a JWT cookie
- `logout()`: Clears the authentication cookie
- `getCurrentUser()`: Retrieves the current authenticated user

## User Management

User management functionality is implemented in `actions/user.ts`:

- `register(formData: FormData)`: Creates a new user account
- `updateUser(id: number, data: Partial<UserInput>)`: Updates user information
- `deleteUser(id: number)`: Deletes a user account

Users have two roles: 'VIEW' and 'MANAGE', which determine their access levels in the system.

## Category Management

Category management is handled in `actions/category.ts`:

- `getCategories(search: string)`: Retrieves categories, optionally filtered by search term
- `createCategory(name: string)`: Creates a new category
- `updateCategory(id: number, name: string)`: Updates a category's name
- `deleteCategory(id: number)`: Deletes a category

## Item Management

Item management functionality is in `actions/item.ts`:

- `getItems(search: string, categoryId?: number, page: number, pageSize: number)`: Retrieves items with pagination and optional filtering
- `createItem(data: ItemFormData)`: Creates a new inventory item
- `updateItem(id: number, data: Partial<ItemFormData>)`: Updates an item's information
- `deleteItem(id: number)`: Deletes an item
- `getItemById(id: number)`: Retrieves a single item by its ID

## Dashboard

The dashboard (`app/admin/dashboard/page.tsx`) provides an overview of the system, including:

- Total number of users
- Total number of items
- Total number of categories
- Number of items with expired prices
- List of recently expired items

## Audit Logging

The system logs various activities for auditing purposes. Logged activities include:

- User logins and logouts
- User registrations
- Category creation, updates, and deletions
- Item creation, updates, and deletions

Audit logs can be viewed in the admin section, with filtering options for user, action, and date range.

## API Routes

The application uses Next.js API routes for server-side operations. These are located in the `app/api` directory.

## Database Schema

The database schema is defined in `prisma/schema.prisma`. It includes models for User, Category, Item, and AuditLog.

## Styling

The application uses Tailwind CSS for styling, along with the shadcn/ui component library. Custom styles can be added in the `app/globals.css` file.

## Deployment

To deploy the application:

1. Set up a production PostgreSQL database
2. Update the `DATABASE_URL` in your production environment
3. Set the `JWT_SECRET` in your production environment
4. Build the application: `npm run build`
5. Start the production server: `npm start`

For platform-specific deployment instructions (e.g., Vercel, Heroku), refer to their respective documentation.
