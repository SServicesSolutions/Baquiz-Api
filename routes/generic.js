const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const GenericController = require('../controllers/genericController');
const { authenticateToken, validateApiKey } = require('../middleware/auth');

// Get all tables
router.get('/tables',
  validateApiKey,
  async (req, res, next) => {
    try {
      const tables = await GenericController.getTables();
      res.json(tables);
    } catch (err) {
      next(err);
    }
  }
);

// Generic CRUD endpoints
router.route('/:table')
  .get(
    validateApiKey,
    query('page').optional().isInt({ min: 1 }),
    async (req, res, next) => {
      try {
        const result = await GenericController.handleOperation(
          req.params.table,
          'SELECT'
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  )
  .post(
    authenticateToken,
    validateApiKey,
    body().isObject(),
    async (req, res, next) => {
      try {
        const result = await GenericController.handleOperation(
          req.params.table,
          'INSERT',
          req.body
        );
        res.status(201).json(result);
      } catch (err) {
        next(err);
      }
    }
  );

router.route('/:table/:id')
  .put(
    authenticateToken,
    validateApiKey,
    param('id').isAlphanumeric(),
    body().isObject(),
    async (req, res, next) => {
      try {
        const result = await GenericController.handleOperation(
          req.params.table,
          'UPDATE',
          req.body,
          req.params.id
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  )
  .delete(
    authenticateToken,
    validateApiKey,
    param('id').isAlphanumeric(),
    async (req, res, next) => {
      try {
        const result = await GenericController.handleOperation(
          req.params.table,
          'DELETE',
          null,
          req.params.id
        );
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  );

module.exports = router;
