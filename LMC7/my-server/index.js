const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const multer = require('multer'); // multer 라이브러리 가져오기
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0000',
  database: 'ecommerce1'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});




app.post('/fetch-recommendations', (req, res) => {
  const { userID } = req.body;

  const userQuery = 'SELECT personalColor FROM users WHERE userID = ?';
  db.query(userQuery, [userID], (err, userResult) => {
    if (err) {
      console.error('Error fetching user personal color:', err);
      return res.status(500).send('Error fetching user personal color');
    }

    if (userResult.length === 0) {
      return res.status(404).send('User not found');
    }

    const personalColor = userResult[0].personalColor;
    console.log('User personalColor:', personalColor); // personalColor 로그 출력

    let colorCondition = '';

    if (personalColor === 'warm') {
      colorCondition = "color IN ('빨강', '노랑', '주황', '갈색', '초록', '흰', '검정')";
    } else if (personalColor === 'cool') {
      colorCondition = "color IN ('보라', '연두', '핑크', '민트', '파랑', '흰', '검정')";
    } else {
      return res.status(400).send('Invalid personal color');
    }

    const productQuery = `SELECT * FROM products WHERE ${colorCondition}`;
    db.query(productQuery, (err, productResults) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).send('Error fetching products');
      }

      res.send(productResults);
    });
  });
});






app.post('/save-size', (req, res) => {
  const { userID, subCategory, ...sizes } = req.body;

  console.log('Request body:', req.body);

  // users 테이블에서 userID를 사용하여 id를 조회하는 쿼리
  const userQuery = 'SELECT id FROM users WHERE userID = ?';
  db.query(userQuery, [userID], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error fetching user ID');
    }

    if (results.length === 0) {
      return res.status(400).send('User not found');
    }

    const userTableID = results[0].id;

    let query = '';
    let values = [];

    switch(subCategory) {
      case '반소매티셔츠':
      case '긴소매티셔츠':
      case '셔츠':
      case '점퍼':
      case '헤비아우터':
      case '블레이저':
      case '코트':
        query = 'INSERT INTO tops (userID, subCategory, totalLength, shoulderWidth, chestWidth, sleeveLength) VALUES (?, ?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.totalLength, sizes.shoulderWidth, sizes.chestWidth, sizes.sleeveLength];
        break;
      case '반소매_래글런':
      case '긴소매_래글런':
      case '점퍼_래글런':
        query = 'INSERT INTO raglan_tops (userID, subCategory, totalLength, chestWidth, sleeveLength) VALUES (?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.totalLength, sizes.chestWidth, sizes.sleeveLength];
        break;
      case '민소매':
        query = 'INSERT INTO sleeveless_tops (userID, subCategory, totalLength, chestWidth, shoulderWidth) VALUES (?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.totalLength, sizes.chestWidth, sizes.shoulderWidth];
        break;
      case '원피스':
        query = 'INSERT INTO dresses (userID, subCategory, totalLength, shoulderWidth, chestWidth, sleeveLength, hipWidth) VALUES (?, ?, ?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.totalLength, sizes.shoulderWidth, sizes.chestWidth, sizes.sleeveLength, sizes.hipWidth];
        break;
      case '바지':
      case '반바지':
      case '레깅스':
        query = 'INSERT INTO bottoms (userID, subCategory, totalLength, waistWidth, hipWidth, thighWidth, rise, hemWidth) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.totalLength, sizes.waistWidth, sizes.hipWidth, sizes.thighWidth, sizes.rise, sizes.hemWidth];
        break;
      case '스커트':
        query = 'INSERT INTO skirts (userID, subCategory, totalLength, waistWidth, hipWidth, hemWidth) VALUES (?, ?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.totalLength, sizes.waistWidth, sizes.hipWidth, sizes.hemWidth];
        break;
      case '가방':
      case '메신저백':
      case '웨이스트백':
      case '토드/핸드백':
      case '보스턴/더플백':
      case '캐리어':
        query = 'INSERT INTO bags (userID, subCategory, height, width, depth) VALUES (?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.height, sizes.width, sizes.depth];
        break;
      case '크로스백':
        query = 'INSERT INTO cross_bags (userID, subCategory, height, width, depth, strapLength) VALUES (?, ?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.height, sizes.width, sizes.depth, sizes.strapLength];
        break;
      case '스니커즈':
      case '신발':
        query = 'INSERT INTO shoes (userID, subCategory, ankleHeight, heelHeight, ballWidth, footLength) VALUES (?, ?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.ankleHeight, sizes.heelHeight, sizes.ballWidth, sizes.footLength];
        break;
      case '캡/야구모자':
      case '페도라/버킷':
        query = 'INSERT INTO caps (userID, subCategory, brimLength, depth, headCircumference) VALUES (?, ?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.brimLength, sizes.depth, sizes.headCircumference];
        break;
      case '비니':
      case '헌팅/베레':
        query = 'INSERT INTO beanies (userID, subCategory, depth, headCircumference) VALUES (?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.depth, sizes.headCircumference];
        break;
      case '속옷_하의':
        query = 'INSERT INTO underwear (userID, subCategory, waistWidth, hipWidth) VALUES (?, ?, ?, ?)';
        values = [userTableID, subCategory, sizes.waistWidth, sizes.hipWidth];
        break;
      case '양말':
        query = 'INSERT INTO socks (userID, subCategory, length) VALUES (?, ?, ?)';
        values = [userTableID, subCategory, sizes.length];
        break;
      default:
        return res.status(400).send({ error: 'Invalid subCategory' });
    }

    console.log('Query:', query);
    console.log('Values:', values);

    db.query(query, values, (error, results) => {
      if (error) {
        console.error('Database error:', error);
        res.status(500).send('Error saving data');
      } else {
        res.send('Size saved successfully');
      }
    });
  });
});

app.get('/get-sizes', (req, res) => {
  const { userID } = req.query;

  const query = `
    SELECT * FROM tops WHERE userID = ?
    UNION ALL
    SELECT * FROM raglan_tops WHERE userID = ?
    UNION ALL
    SELECT * FROM sleeveless_tops WHERE userID = ?
    UNION ALL
    SELECT * FROM dresses WHERE userID = ?
    UNION ALL
    SELECT * FROM bottoms WHERE userID = ?
    UNION ALL
    SELECT * FROM skirts WHERE userID = ?
    UNION ALL
    SELECT * FROM bags WHERE userID = ?
    UNION ALL
    SELECT * FROM cross_bags WHERE userID = ?
    UNION ALL
    SELECT * FROM shoes WHERE userID = ?
    UNION ALL
    SELECT * FROM caps WHERE userID = ?
    UNION ALL
    SELECT * FROM beanies WHERE userID = ?
    UNION ALL
    SELECT * FROM underwear WHERE userID = ?
    UNION ALL
    SELECT * FROM socks WHERE userID = ?;
  `;

  db.query(query, Array(13).fill(userID), (err, results) => {
    if (err) {
      console.error('Error fetching sizes:', err);
      res.status(500).send('Error fetching sizes');
    } else {
      const sizes = {};
      results.forEach(row => {
        sizes[row.subCategory] = row;
      });
      res.send(sizes);
    }
  });
});




















app.post('/savePersonalColor', (req, res) => {
  const { userID, personalColor } = req.body;

  if (!userID || !personalColor) {
    return res.status(400).send({ error: 'UserID and PersonalColor are required' });
  }

  const query = 'UPDATE users SET personalColor = ? WHERE userID = ?';
  db.query(query, [personalColor, userID], (err, result) => {
    if (err) {
      console.error('Error updating personal color:', err);
      return res.status(500).send({ error: 'Database error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).send({ error: 'User not found' });
    }

    return res.send({ success: true, message: 'Personal color updated successfully' });
  });
});


// Multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage }); // upload 변수를 정의합니다.

// 리뷰와 이미지 업로드 엔드포인트
app.post('/api/addReview', upload.array('images', 10), (req, res) => {
  const { userID, productID, rating, review } = req.body;
  console.log('Received userID:', userID); // 디버그 로그 추가
  console.log('Received productID:', productID); // 디버그 로그 추가

  const imageUrls = req.files.map(file => `/uploads/${file.filename}`);

  const query = 'INSERT INTO reviews (userID, productID, rating, review, images) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [userID, productID, rating, review, JSON.stringify(imageUrls)], (err, result) => {
    if (err) {
      console.error('리뷰 추가 중 오류 발생:', err);
      res.status(500).send('리뷰 추가 중 오류 발생');
    } else {
      res.send({ success: true, message: '리뷰가 성공적으로 추가되었습니다.' });
    }
  });
});

// 리뷰 가져오기 엔드포인트
app.get('/api/getReviews', (req, res) => {
  const { productID } = req.query;
  const query = 'SELECT * FROM reviews WHERE productID = ?';
  db.query(query, [productID], (err, results) => {
    if (err) {
      console.error('리뷰 가져오기 중 오류 발생:', err);
      res.status(500).send('리뷰 가져오기 중 오류 발생');
    } else {
      res.send(results);
    }
  });
});



// 이메일로 사용자 아이디 찾기
app.post('/api/findUsername', (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: '이메일을 입력해주세요' });
    return;
  }

  const sql = 'SELECT userID FROM users WHERE email = ?';
  db.query(sql, [email], (err, result) => {
    if (err) {
      console.error('아이디 찾기 중 오류 발생:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (result.length > 0) {
      res.json({ username: result[0].userID });
    } else {
      res.status(404).json({ error: '해당 이메일로 등록된 사용자를 찾을 수 없습니다.' });
    }
  });
});


// 이메일과 아이디로 비밀번호 찾기
app.post('/api/findPassword', (req, res) => {
  const { email, userID } = req.body;

  if (!email || !userID) {
    res.status(400).json({ error: '이메일과 아이디를 모두 입력해주세요' });
    return;
  }

  const sql = 'SELECT password FROM users WHERE email = ? AND userID = ?';
  db.query(sql, [email, userID], (err, result) => {
    if (err) {
      console.error('비밀번호 찾기 중 오류 발생:', err);
      res.status(500).json({ error: err.message });
      return;
    }

    if (result.length > 0) {
      res.json({ success: true, password: result[0].password });
    } else {
      res.status(404).json({ success: false, error: '해당 이메일 또는 아이디로 등록된 사용자를 찾을 수 없습니다.' });
    }
  });
});


// 상품 문의 추가하기
app.post('/inquiries', (req, res) => {
  const { userID, nickname, question } = req.body;

  if (!userID || !nickname || !question) {
    res.status(400).json({ error: '모든 필드를 입력해주세요' });
    return;
  }

  const sqlInsert = 'INSERT INTO inquiries (userID, nickname, question) VALUES (?, ?, ?)';
  db.query(sqlInsert, [userID, nickname, question], (err, result) => {
    if (err) {
      console.error('상품 문의 작성 중 오류 발생:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '문의가 작성되었습니다.', inquiryId: result.insertId });
  });
});

// 상품 문의 목록 가져오기
app.get('/inquiries', (req, res) => {
  const { userID } = req.query;

  let sqlSelect;
  const params = [];

  if (userID === 'yunnamgyun0316') {
    sqlSelect = 'SELECT * FROM inquiries ORDER BY date DESC';
  } else {
    sqlSelect = 'SELECT * FROM inquiries WHERE userID = ? ORDER BY date DESC';
    params.push(userID);
  }

  db.query(sqlSelect, params, (err, result) => {
    if (err) {
      console.error('상품 문의 목록 가져오는 중 오류 발생:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// 상품 문의에 대한 운영자 답변 추가하기
app.post('/inquiries/:id/response', (req, res) => {
  const { id } = req.params;
  const { adminResponse } = req.body;

  if (!adminResponse) {
    res.status(400).json({ error: '답변 내용을 입력해주세요' });
    return;
  }

  const sqlUpdate = 'UPDATE inquiries SET admin_response = ? WHERE id = ?';
  db.query(sqlUpdate, [adminResponse, id], (err, result) => {
    if (err) {
      console.error('운영자 답변 추가 중 오류 발생:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '답변이 추가되었습니다.' });
  });
});

// 유저의 찜 목록에 상품 추가
app.post('/api/addToWishlist', (req, res) => {
  const { userID, productID } = req.body;
  
  const checkQuery = 'SELECT * FROM user_wishlist WHERE userID = ? AND productID = ?';
  db.query(checkQuery, [userID, productID], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking wishlist:', checkError);
      return res.status(500).json({ error: 'Error checking wishlist' });
    }
    
    if (checkResults.length > 0) {
      return res.status(400).json({ error: 'Product is already in wishlist' });
    }
    
    const query = 'INSERT INTO user_wishlist (userID, productID) VALUES (?, ?)';
    db.query(query, [userID, productID], (error, results) => {
      if (error) {
        console.error('Error adding to wishlist:', error);
        return res.status(500).json({ error: 'Error adding to wishlist' });
      }
      res.status(200).json({ success: true });
    });
  });
});

// 찜 목록 가져오기
app.get('/wishlist', (req, res) => {
  const { userID } = req.query;
  console.log(`Fetching wishlist for userID: ${userID}`); // 추가된 로그

  const query = `
    SELECT products.* FROM products
    JOIN user_wishlist ON products.id = user_wishlist.productID
    WHERE user_wishlist.userID = ?;
  `;
  db.query(query, [userID], (error, results) => {
    if (error) {
      console.error('Error fetching wishlist:', error);
      return res.status(500).json({ error: 'Error fetching wishlist' });
    }
    res.status(200).json(results);
  });
});

// 로그인 엔드포인트
app.post('/api/login', (req, res) => {
  const { userID, password } = req.body;
  console.log('로그인 요청:', { userID, password });

  const query = 'SELECT userID, password, nickname FROM users WHERE userID = ? AND password = ?';
  db.query(query, [userID, password], (error, results) => {
    if (error) {
      console.error('로그인 중 오류 발생:', error);
      res.status(500).json({ error: '로그인 중 오류가 발생했습니다.' });
      return;
    }

    console.log('로그인 쿼리 결과:', results);
    if (results.length === 1) {
      const user = results[0];
      console.log('로그인 성공:', user);
      res.status(200).json({ success: true, nickname: user.nickname });
    } else {
      res.status(401).json({ success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }
  });
});

// 회원가입 엔드포인트 추가
app.post('/api/signup', (req, res) => {
  const { userID, password, email, nickname } = req.body;

  // 필수 정보가 비어 있는지 확인
  if (!userID || !password || !email || !nickname) {
    return res.status(400).json({ error: '모든 필수 정보를 입력해야 합니다.' });
  }

  // 이미 등록된 이메일인지 확인
  const emailQuery = `SELECT COUNT(*) AS count FROM users WHERE email = ?`;
  db.query(emailQuery, [email], (emailError, emailResults) => {
    if (emailError) {
      console.error('이메일 중복 확인 중 오류 발생: ', emailError);
      res.status(500).json({ error: '이메일 중복 확인 중 오류가 발생했습니다.' });
      return;
    }
    
    const emailCount = emailResults[0].count;
    if (emailCount > 0) {
      return res.status(400).json({ error: '이미 등록된 이메일입니다.' });
    }

    // 이미 등록된 아이디인지 확인
    const userIDQuery = `SELECT COUNT(*) AS count FROM users WHERE userID = ?`;
    db.query(userIDQuery, [userID], (userIDError, userIDResults) => {
      if (userIDError) {
        console.error('아이디 중복 확인 중 오류 발생: ', userIDError);
        res.status(500).json({ error: '아이디 중복 확인 중 오류가 발생했습니다.' });
        return;
      }
      
      const userIDCount = userIDResults[0].count;
      if (userIDCount > 0) {
        return res.status(400).json({ error: '이미 등록된 아이디입니다.' });
      }

      // 이미 등록된 닉네임인지 확인
      const nicknameQuery = `SELECT COUNT(*) AS count FROM users WHERE nickname = ?`;
      db.query(nicknameQuery, [nickname], (nicknameError, nicknameResults) => {
        if (nicknameError) {
          console.error('닉네임 중복 확인 중 오류 발생: ', nicknameError);
          res.status(500).json({ error: '닉네임 중복 확인 중 오류가 발생했습니다.' });
          return;
        }

        const nicknameCount = nicknameResults[0].count;
        if (nicknameCount > 0) {
          return res.status(400).json({ error: '이미 등록된 닉네임입니다.' });
        }

        // 회원가입 정보를 데이터베이스에 저장
        const insertQuery = `INSERT INTO users (userID, password, email, nickname) VALUES (?, ?, ?, ?)`;
        db.query(insertQuery, [userID, password, email, nickname], (insertError, insertResults) => {
          if (insertError) {
            console.error('회원가입 중 오류 발생: ', insertError);
            res.status(500).json({ error: '회원가입 중 오류가 발생했습니다.' });
            return;
          }

          res.status(200).json({ message: '회원가입이 성공적으로 완료되었습니다.' });
        });
      });
    });
  });
});

// 아이디 중복 확인 엔드포인트 추가
app.post('/api/checkDuplicateID', (req, res) => {
  const { userID } = req.body;

  const query = 'SELECT * FROM users WHERE userID = ?';
  db.query(query, [userID], (error, results) => {
    if (error) {
      console.error('아이디 중복 확인 중 오류 발생:', error);
      res.status(500).json({ error: '아이디 중복 확인 중 오류가 발생했습니다.' });
      return;
    }

    res.status(200).json({ isDuplicate: results.length > 0 });
  });
});

// 이메일 중복 확인 엔드포인트 추가
app.post('/api/checkDuplicateEmail', (req, res) => {
  const { email } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (error, results) => {
    if (error) {
      console.error('이메일 중복 확인 중 오류 발생:', error);
      res.status(500).json({ error: '이메일 중복 확인 중 오류가 발생했습니다.' });
      return;
    }

    res.status(200).json({ isDuplicate: results.length > 0 });
  });
});

// 닉네임 중복 확인 엔드포인트 추가
app.post('/api/checkDuplicateNickname', (req, res) => {
  const { nickname } = req.body;

  const query = 'SELECT * FROM users WHERE nickname = ?';
  db.query(query, [nickname], (error, results) => {
    if (error) {
      console.error('닉네임 중복 확인 중 오류 발생:', error);
      res.status(500).json({ error: '닉네임 중복 확인 중 오류가 발생했습니다.' });
      return;
    }

    res.status(200).json({ isDuplicate: results.length > 0 });
  });
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/products', (req, res) => {
  const { category, subCategory } = req.query;

  let sql = 'SELECT * FROM products';
  const params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);

    if (subCategory) {
      sql += ' AND subCategory = ?';
      params.push(subCategory);
    }
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

app.post('/products', (req, res) => {
  const { name, price, description, category, subCategory, productImages, infoImages, sizeImages, brand, season, gender, color } = req.body;

  console.log('Received request to add product:', req.body);

  if (!name || !price || !category || !subCategory || !productImages || !infoImages || !sizeImages) {
    console.error('Validation error:', req.body);
    res.status(400).json({ error: '모든 필드를 입력해주세요' });
    return;
  }

  const saveImages = (images, type) => {
    return images.map((base64, index) => {
      const buffer = Buffer.from(base64, 'base64');
      const fileName = `${Date.now()}_${type}_${index}.jpg`;
      const filePath = path.join(__dirname, 'uploads', fileName);

      fs.writeFileSync(filePath, buffer);

      return `http://192.168.45.126:3000/uploads/${fileName}`;
    });
  };

  const productImageUrls = saveImages(productImages, 'product');
  const infoImageUrls = saveImages(infoImages, 'info');
  const sizeImageUrls = saveImages(sizeImages, 'size');

  const sql = 'INSERT INTO products (name, price, description, category, subCategory, image_url, info_image_url, size_image_url, brand, season, gender, color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [name, price, description, category, subCategory, JSON.stringify(productImageUrls), JSON.stringify(infoImageUrls), JSON.stringify(sizeImageUrls), brand, season, gender, color], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    console.log('Product added successfully:', result.insertId);
    res.json({ message: 'Product added', productId: result.insertId });
  });
});



app.post('/cart', (req, res) => {
  const { userId, productId, quantity } = req.body;

  console.log('Received data for cart:', { userId, productId, quantity });

  if (!userId || !productId || !quantity) {
    res.status(400).json({ error: '모든 필드를 입력해주세요' });
    return;
  }

  const sql = 'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)';
  db.query(sql, [userId, productId, quantity], (err, result) => {
    if (err) {
      console.error('Error adding product to cart:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'Product added to cart', cartId: result.insertId });
  });
});




app.get('/cart', (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = `
    SELECT c.id, c.quantity, p.name, p.price, p.image_url
    FROM cart c
    JOIN products p ON c.product_id = p.id
    WHERE c.user_id = ?
  `;
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});




app.delete('/cart/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM cart WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json({ message: 'Item deleted' });
  });
});

app.delete('/cart', (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  const sql = 'DELETE FROM cart WHERE user_id = ?';
  db.query(sql, [userId], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: 'All items deleted from cart' });
  });
});



// 공지사항 목록 가져오기
app.get('/notices', (req, res) => {
  const sql = `
    SELECT notices.*, users.nickname 
    FROM notices 
    JOIN users ON notices.userID = users.userID 
    ORDER BY notices.date DESC
  `;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(result);
  });
});

// 공지사항 추가하기 (관리자용, 실제로는 인증된 관리자만 접근할 수 있도록 해야 함)
app.post('/notices', (req, res) => {
  const { title, content, userID } = req.body;

  console.log('공지사항 작성 요청:', req.body);

  if (!title || !content || !userID) {
    console.error('필수 항목 누락:', req.body);
    res.status(400).json({ error: '제목, 내용, 작성자 ID를 입력해주세요' });
    return;
  }

  const sqlInsert = 'INSERT INTO notices (title, content, userID) VALUES (?, ?, ?)';
  db.query(sqlInsert, [title, content, userID], (err, result) => {
    if (err) {
      console.error('공지사항 작성 중 오류 발생:', err);
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: '공지사항이 추가되었습니다.', noticeId: result.insertId });
  });
});



app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
