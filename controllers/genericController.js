const pool = require('../config/db');
const { ValidationError } = require('../utils/errors');

const allowedOperations = {
  GET: 'SELECT',
  POST: 'INSERT',
  PUT: 'UPDATE',
  DELETE: 'DELETE'
};

class GenericController {
  static async handleOperation(table, operation, data = null, id = null) {
    const validTables = await this.getTables();

    if (!validTables.includes(table)) {
      throw new ValidationError('Invalid table name');
    }

    const query = this.buildQuery(table, operation, data, id);
    const [result] = await pool.query(query.sql, query.values);

    return this.formatResult(operation, result);
  }

  static async getTables() {
    const [tables] = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = ?",
      [process.env.DB_NAME]
    );
    return tables.map(t => t.TABLE_NAME);
  }

  static buildQuery(table, operation, data, id) {
    switch(operation) {
      case 'SELECT':
        return { sql: `SELECT * FROM ??`, values: [table] };
      case 'INSERT':
        return { sql: `INSERT INTO ?? SET ?`, values: [table, data] };
      case 'UPDATE':
        return { sql: `UPDATE ?? SET ? WHERE id = ?`, values: [table, data, id] };
      case 'DELETE':
        return { sql: `DELETE FROM ?? WHERE id = ?`, values: [table, id] };
      default:
        throw new ValidationError('Invalid operation');
    }
  }

  static formatResult(operation, result) {
    const response = { operation };
    if (operation === 'SELECT') response.data = result;
    if (operation === 'INSERT') response.id = result.insertId;
    return response;
  }
}

module.exports = GenericController;
