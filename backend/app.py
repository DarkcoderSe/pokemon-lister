import os
import csv
from flask import Flask, request, jsonify
from models import db, Pokemon
from flask_cors import CORS 



app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///pokemons.db'
db.init_app(app)

    
def load_data_from_csv():
    csv_file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'pokemon_data.csv')

    print("Loading data....")
    # Check if data already exists in the Pokemon table
    if Pokemon.query.first():
        print("Data is already loaded. Skipping data loading.")
        return

    with open(csv_file_path, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            name = row['Name']
            base_experience = int(row['Base Experience']) if row['Base Experience'] else 0
            height = float(row['Height']) if row['Height'] else None
            weight = float(row['Weight']) if row['Weight'] else None
            image_url = row['Image URL']

            pokemon = Pokemon(name=name,
                              base_experience=base_experience,
                              height=height,
                              weight=weight,
                              image_url=image_url)
            db.session.add(pokemon)

    db.session.commit()
    print("Data loaded successfully.")


with app.app_context():
    db.create_all()
    load_data_from_csv()
    
def paginate(endpoint_function):
    def wrapper(*args, **kwargs):
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 10))
        query = endpoint_function(*args, **kwargs)

        pagination = query.paginate(page=page, per_page=per_page, error_out=False)
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

    filters = {}
    for key in ['name', 'base_experience', 'height', 'weight']:
        value = request.args.get(key)
        if value:
            if key == 'name':
                query = query.filter(Pokemon.name.ilike(f'%{value}%'))
            else:
                operator = '__lt'  # Default operator for numeric conditions (less than)
                try:
                    # Check if the value can be converted to a number
                    numeric_value = float(value)
                    filters[key] = numeric_value
                except ValueError:
                    pass

            if key in filters:
                # Apply numeric condition (less than)
                query = query.filter(getattr(Pokemon, key) < filters[key])
                
    return query  # Return the query object, not the result set



if __name__ == '__main__':

    app.run(debug=True)


