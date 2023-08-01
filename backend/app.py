import csv
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pokemons.db'
db = SQLAlchemy(app)

class Pokemon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    base_experience = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'base_experience': self.base_experience,
            'height': self.height,
            'weight': self.weight,
            'image_url': self.image_url
        }
    
def load_data_from_csv():
    # Check if data already exists in the Pokemon table
    if Pokemon.query.first():
        print("Data is already loaded. Skipping data loading.")
        return

    with open('pokemon_data.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            pokemon = Pokemon(name=row['Name'],
                              base_experience=int(row['Base Experience']),
                              height=float(row['Height']),
                              weight=float(row['Weight']),
                              image_url=row['Image URL'])
            db.session.add(pokemon)

    db.session.commit()
    print("Data loaded successfully.")

    
def paginate(endpoint_function):
    def wrapper(*args, **kwargs):
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        query = endpoint_function(*args, **kwargs)

        pagination = query.paginate(page, per_page, error_out=False)
        result = {
            'page': page,
            'per_page': per_page,
            'total_pages': pagination.pages,
            'total_items': pagination.total,
            'items': [item.to_dict() for item in pagination.items]
        }
        return jsonify(result)

    return wrapper


@app.route('/pokemons', methods=['GET'])
@paginate
def get_pokemons():
    query = Pokemon.query

    # Sorting
    sort_by = request.args.get('sort_by')
    if sort_by:
        if sort_by.startswith('-'):
            sort_by = sort_by[1:]
            query = query.order_by(getattr(Pokemon, sort_by).desc())
        else:
            query = query.order_by(getattr(Pokemon, sort_by))

    # Filtering
    filters = {}
    for key in ['name', 'base_experience', 'height', 'weight']:
        value = request.args.get(key)
        if value:
            filters[key] = value

    query = query.filter_by(**filters)
    return query  # Return the query object, not the result set


if __name__ == '__main__':
    load_data_from_csv()
    app.run(debug=True)
