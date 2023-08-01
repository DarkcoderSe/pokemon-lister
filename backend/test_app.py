import pytest
from app import app, db
from models import Pokemon

# Define test cases
def test_get_pokemons_with_no_filters(client):
    response = client.get('/pokemons')
    assert response.status_code == 200

    data = response.get_json()
    assert 'items' in data
    assert 'total_pages' in data

def test_get_pokemons_with_name_filter(client):
    response = client.get('/pokemons?name=charizard')
    assert response.status_code == 200

    data = response.get_json()
    assert 'items' in data
    assert 'total_pages' in data

def test_get_pokemons_with_base_experience_filter(client):
    response = client.get('/pokemons?base_experience=100')
    assert response.status_code == 200

    data = response.get_json()
    assert 'items' in data
    assert 'total_pages' in data

def test_get_pokemons_with_height_filter(client):
    response = client.get('/pokemons?height=150')
    assert response.status_code == 200

    data = response.get_json()
    assert 'items' in data
    assert 'total_pages' in data

def test_get_pokemons_with_weight_filter(client):
    response = client.get('/pokemons?weight=50')
    assert response.status_code == 200

    data = response.get_json()
    assert 'items' in data
    assert 'total_pages' in data

# Fixture to create a test client
@pytest.fixture
def client():
    app.config['TESTING'] = True
    client = app.test_client()

    with app.app_context():
        db.create_all()
        # Add test data (you can modify this to add sample data for testing)
        pokemon1 = Pokemon(name='charizard', base_experience=100, height=200, weight=100, image_url='http://someimage.img/image.png')
        pokemon2 = Pokemon(name='bulbasaur', base_experience=50, height=100, weight=30, image_url='http://someimage.img/image.png')
        db.session.add_all([pokemon1, pokemon2])
        db.session.commit()

    yield client

    with app.app_context():
        db.session.remove()
        db.drop_all()
