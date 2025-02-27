const { PrismaClient } = require('@prisma/client');
const { get } = require('../routes/api');
const e = require('express');
const prisma = new PrismaClient();
 
// insert one customer
const createCustomer = async (req, res) => {
    const { customer_id, first_name, last_name, address, email, phone_number } = req.body;
 
    try {
      // สร้างข้อมูลลูกค้าใหม่
      const cust = await prisma.customers.create({
        data: {
          customer_id,
          first_name,
          last_name,
          address,
          email,
          phone_number
        }
      });
 
      // ส่งการตอบกลับเมื่อสร้างลูกค้าสำเร็จ
      res.status(200).json({
        status: "ok",
        message: `User with ID = ${cust.customer_id} is created` // ส่ง ID ที่ถูกสร้างกลับไป
      });
    } catch (err) {
      // จัดการข้อผิดพลาด
      res.status(500).json({
        status: "error",
        message: "Failed to create user",
        error: err.message
      });
    }
  };

  const getCustomers = async (req, res) => {
    const custs = await prisma.customers.findMany();
    res.json(custs)
};

  const deleteCustomer = async (req, res) => {
    const { id } = req.params;
  
    try {
      // ลบข้อมูลลูกค้า
      const existingCustomer = await prisma.customers.findUnique({
        where: {
          customer_id: parseInt(id),
        },
      });
      if (!existingCustomer) { 
        return res.status(404).json({message: `User with ID = ${id} is not found`,});
      }
      await prisma.customers.delete({
        where: {
          customer_id: parseInt(id),
        },
      });
      res.status(200).json({
        status: "ok",
        message: `User with ID = ${id} is deleted`,
      });
    } catch (err) {
      console.error('Delete customer error:', err);
      res.status(500).json({ error: err.message});
    }
  };

  //getcustomerbyid
  const getCustomer = async (req, res) => {
    const { id } = req.params;
    try {
      const cust = await prisma.customers.findUnique({
        where: {
          customer_id: parseInt(id),
        },
      });
      if (!cust) {
        return res.status(404).json({message: 'Customer not found',});
      } else {
        res.status(200).json(cust);
      }
    } catch (err) {
      res.status(500).json(err);
    }
  };

  //updatecustomer by id
  const updateCustomer = async (req, res) => {
    const { first_name, last_name, address, email, phone_number } = req.body;
    const { id } = req.params;

    const data = {};
    if (first_name) data.first_name = first_name;
    if (last_name) data.last_name = last_name;
    if (address) data.address = address;
    if (email) data.email = email;
    if (phone_number) data.phone_number = phone_number;


    if (Object.keys(data).length === 0) {
      return res.status(400).json({
        status: 'error',
        message: 'No data provided for update',
      });
    }
    try {
      const cust = await prisma.customers.update({
      data,
      where: {customer_id: Number(id),},
      });
      res.status(200).json({
        status: 'ok',
        message: `User with ID = ${id} is updated`,
        user: cust,
      });
    } catch (err) {
      if (err.code === 'P2002') {
        res.status(400).json({
          status: 'error',
          message: 'Email already exists',
        });
      } else if (err.code === 'P2025') {
        res.status(400).json({
          status: 'error',
          message: `User with ID = ${id} is not found`,
        });
      } else {
        console.error('Update customer error:', err);
        res.status(500).json({
          status: 'error',
          message: 'Failed to update user',
        });
      }
    }
  };

module.exports = {
    createCustomer, getCustomers, deleteCustomer , getCustomer , updateCustomer
};