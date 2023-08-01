class Pokemon(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    base_experience = db.Column(db.Integer, nullable=False)
    height = db.Column(db.Float, nullable=False)
    weight = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(200), nullable=False)

    def __repr__(self):
        return f"Pokemon('{self.name}', '{self.base_experience}', '{self.height}', '{self.weight}', '{self.image_url}')"
