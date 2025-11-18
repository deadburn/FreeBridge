from app import app

# No es necesario llamar a db.create_all() aquí
# ya que app.py lo hace al importarse

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
