import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle
import os

def generate_mock_data(n=1000):
    np.random.seed(42)
    data = {
        'history_no_show_count': np.random.randint(0, 10, n),
        'days_since_booking': np.random.randint(1, 60, n),
        'age': np.random.randint(18, 90, n),
        'hour_of_day': np.random.randint(8, 17, n),
        'day_of_week': np.random.randint(0, 5, n),
    }
    df = pd.DataFrame(data)
    
    # Simple logic for target 'no_show'
    # High history + long lead time = high chance
    prob = (df['history_no_show_count'] * 0.1) + (df['days_since_booking'] * 0.005)
    df['no_show'] = (prob + np.random.normal(0, 0.1, n) > 0.6).astype(int)
    
    return df

def train_model():
    print("Generating training data...")
    df = generate_mock_data()
    
    X = df.drop('no_show', axis=1)
    y = df['no_show']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("Training RandomForest classifier...")
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    
    accuracy = model.score(X_test, y_test)
    print(f"Model Accuracy: {accuracy:.4f}")
    
    # Save the model
    if not os.path.exists('models'):
        os.makedirs('models')
    
    with open('models/noshow_model.pkl', 'wb') as f:
        pickle.dump(model, f)
    
    print("Model saved to models/noshow_model.pkl")

if __name__ == "__main__":
    train_model()
