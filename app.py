import os
import sqlite3

from flask import Flask, redirect, render_template, request, session, url_for
from werkzeug.security import check_password_hash, generate_password_hash

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.environ.get('DATABASE_PATH', os.path.join(BASE_DIR, 'shopflow.db'))

app = Flask(__name__)
app.secret_key = os.environ.get('SECRET_KEY', 'local-development-key')
app.config['SESSION_COOKIE_HTTPONLY'] = True
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
app.config['SESSION_COOKIE_SECURE'] = os.environ.get('SESSION_COOKIE_SECURE', 'false').lower() == 'true'


def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_db_connection() as conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            )
            '''
        )
        conn.execute(
            'INSERT OR IGNORE INTO users (name, email, password) VALUES (?, ?, ?)',
            ('demo', 'demo@example.com', generate_password_hash('123456')),
        )
        conn.commit()


init_db()


@app.route('/')
def home():
    return render_template('index.html', user=session.get('user'))


@app.route('/logout')
def logout():
    session.pop('user', None)
    return redirect(url_for('home'))


@app.route('/login', methods=['GET', 'POST'])
def login_page():
    if request.method == 'POST':
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '').strip()

        if not email or not password:
            return render_template('login.html', error='Please fill in all fields.', mode='login')

        with get_db_connection() as conn:
            user = conn.execute('SELECT * FROM users WHERE email = ?', (email,)).fetchone()

        if user is None:
            return render_template('login.html', error='Invalid email or password.', mode='login')

        password_matches = check_password_hash(user['password'], password)
        if not password_matches and user['password'] == password:
            with get_db_connection() as conn:
                conn.execute(
                    'UPDATE users SET password = ? WHERE id = ?',
                    (generate_password_hash(password), user['id']),
                )
            password_matches = True

        if not password_matches:
            return render_template('login.html', error='Invalid email or password.', mode='login')

        session['user'] = {'id': user['id'], 'name': user['name'], 'email': user['email']}
        return redirect(url_for('home'))

    return render_template('login.html', error=None, mode='login', user=session.get('user'))


@app.route('/signup', methods=['GET', 'POST'])
def signup_page():
    if request.method == 'POST':
        name = request.form.get('name', '').strip()
        email = request.form.get('email', '').strip().lower()
        password = request.form.get('password', '').strip()

        if not name or not email or not password:
            return render_template('login.html', error='Please complete all fields.', mode='signup')

        try:
            with get_db_connection() as conn:
                cursor = conn.execute(
                    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
                    (name, email, generate_password_hash(password)),
                )
                conn.commit()
                user_id = cursor.lastrowid
        except sqlite3.IntegrityError:
            return render_template('login.html', error='This email is already registered.', mode='signup')

        session['user'] = {'id': user_id, 'name': name, 'email': email}
        return redirect(url_for('home'))

    return render_template('login.html', error=None, mode='signup', user=session.get('user'))


if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))
