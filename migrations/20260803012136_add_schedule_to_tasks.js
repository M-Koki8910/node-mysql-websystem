/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.table('tasks', function(table) {

    table.date('start_date');
    table.date('end_date');

    table.time('start_time');
    table.time('end_time');

    table.integer('type_id');

  });
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.table('tasks', function(table) {

    table.dropColumn('start_date');
    table.dropColumn('end_date');

    table.dropColumn('start_time');
    table.dropColumn('end_time');

    table.dropColumn('type_id');

  });
};