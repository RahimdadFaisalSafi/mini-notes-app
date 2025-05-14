# Reflection on Database Integration

## Backend Code Changes for Database Persistence

The key changes in switching from file-based to database persistence were:
1. Replacing `loadNotes()` and `saveNotes()` functions with database queries
2. Using parameterized SQL queries in route handlers
3. Implementing connection pooling with `pg.Pool`
4. Error handling specific to database operations

## Connection Pool Benefits

Using `pg.Pool` instead of a single `pg.Client` offers several advantages:
- Efficient connection management
- Handles multiple concurrent database requests
- Automatically manages connection lifecycle
- Prevents connection exhaustion
- Reduces overhead of creating new connections for each query

Example:
```javascript
const pool = new Pool({
    max: 20, // Maximum 20 simultaneous connections
    idleTimeoutMillis: 30000 // Connections idle for 30s are closed
});
```

## Preventing SQL Injection

Example of parameterized query:
```javascript
// Prevents SQL injection by using $1 placeholder
const { rows } = await db.query(
    'INSERT INTO notes (text) VALUES ($1) RETURNING *', 
    [text]
);
```

Without parameterization, a malicious input like `text = "'); DROP TABLE notes; --"` could cause significant damage. Parameterized queries treat input as data, not executable code.

## Manual Schema Management Disadvantages

Current manual process challenges:
- No version control for database schema
- Requires manual intervention for schema changes
- Difficult to manage in team environments
- No automated migration path
- Potential for human error
- Inconsistent database states across different environments

Better approaches include:
- Database migration tools (e.g., Flyway, Liquibase)
- ORM solutions with migration support
- Infrastructure as Code (IaC) for database schemas

## Ensuring Database Readiness

Strategies implemented:
1. Logging connection details
2. Testing connection in server startup
3. Using `depends_on` in Docker Compose
4. Adding connection timeout and error handling

Example connection test:
```javascript
app.listen(PORT, async () => {
    try {
        // Test database connection
        await db.query('SELECT NOW()');
        console.log('Database connection established successfully.');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
        process.exit(1);
    }
});
```

## Conclusion

The transition to database persistence introduces more robust, scalable data management with improved security and performance characteristics.