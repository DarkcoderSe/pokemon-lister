from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

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