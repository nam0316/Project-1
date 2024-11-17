from flask import Flask, render_template, request, redirect
import cv2
import numpy as np
import os

app = Flask(__name__, template_folder='templates')
app.config['UPLOAD_FOLDER'] = 'uploads'

# 피부톤을 분류하는 함수
def classify_skin_tone(image):
    lab_image = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    pixels = lab_image.reshape(-1, lab_image.shape[-1])
    skin_pixels = [pixel for pixel in pixels if pixel[0] > 20 and pixel[1] > 135 and pixel[2] > 135]
    skin_pixels = np.array(skin_pixels)

    if len(skin_pixels) == 0:
        return "피부색을 감지할 수 없습니다.", []

    mean_l = np.mean(skin_pixels[:, 0])
    mean_a = np.mean(skin_pixels[:, 1])
    mean_b = np.mean(skin_pixels[:, 2])

    skin_tone = "웜톤" if mean_a > 0 and mean_b > 0 else "쿨톤"

    return skin_tone

# 추천 색상을 반환하는 함수
def recommend_colors(skin_tone):
    if skin_tone == "웜톤":
        colors = [
            "#FFA07A", "#FA8072", "#E9967A", "#F08080", "#CD5C5C", "#DC143C", "#FF6347", "#FF4500", "#FF8C00", "#FFD700",
            "#FF7F50", "#FF6F61", "#FF5E5B", "#FF4500", "#FF3E4D", "#FF2D00", "#FF1400", "#FF6600", "#FF7500", "#FF8800",
            "#FF9900", "#FFAA00", "#FFBB00", "#FFCC00", "#FFDD00", "#FFEE00", "#FFFF00", "#F0E68C", "#FFDAB9", "#FFE4B5",
            "#8B4513", "#A0522D", "#D2691E", "#DEB887", "#F4A460", "#DAA520", "#B8860B", "#CD853F", "#D2B48C", "#BC8F8F"
        ]
    else:
        colors = [
            "#ADD8E6", "#87CEEB", "#4682B4", "#1E90FF", "#6495ED", "#00BFFF", "#4169E1", "#0000FF", "#8A2BE2", "#4B0082",
            "#6A5ACD", "#483D8B", "#191970", "#00008B", "#7B68EE", "#9370DB", "#BA55D3", "#9932CC", "#8B008B", "#800080",
            "#4B0082", "#9400D3", "#8A2BE2", "#7FFFD4", "#40E0D0", "#48D1CC", "#20B2AA", "#5F9EA0", "#00CED1", "#4682B4",
            "#008080", "#2E8B57", "#3CB371", "#66CDAA", "#8FBC8F", "#20B2AA", "#5F9EA0", "#7FFF00", "#7CFC00", "#ADFF2F"
        ]
    
    return colors

# 업로드 페이지 렌더링
@app.route('/')
def index():
    return render_template('index.html')

# 파일 업로드 처리
@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files: 
        return redirect(request.url)
    file = request.files['file']
    if file.filename == '':
        return redirect(request.url)
    if file:
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(filepath)

        image = cv2.imread(filepath)

        if image is None:
            return "이미지를 불러오는데 실패했습니다. 올바른 이미지를 업로드해주세요.", 400

        skin_tone = classify_skin_tone(image)
        recommended_colors = recommend_colors(skin_tone)

        return render_template('result.html', skin_tone=skin_tone, recommended_colors=recommended_colors)

if __name__ == '__main__':
    if not os.path.exists(app.config['UPLOAD_FOLDER']):
        os.makedirs(app.config['UPLOAD_FOLDER'])
    app.run(debug=True) 
