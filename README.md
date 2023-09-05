## Hi there👋
* Đây là mã nguồn share ChatBot AI cho mọi người muốn tạo bot riêng.
* Chạy khá đơn giản từ ApiKey của OpenAi
* Đơn giản vậy thôi 😂

## Hướng dẫn (Tutorial) 📋
1. Đầu tiên bạn cần một tài khoản ChatGPT - Open Ai [bấm vào đây](https://platform.openai.com/playground).
2. Sau khi đã có tài khoản thì bạn chỉ cần **Personal** -> **View API Keys**.

![image](https://user-images.githubusercontent.com/40049697/217147548-e0ba6dc7-ccfc-4913-bd7e-3a8db7014937.png)

3. Tại thanh tab bên trái có **API Keys**, Sau đó bạn chọn **Create new secret key**

![image](https://user-images.githubusercontent.com/40049697/217147810-0af82b25-4e31-45cf-9a88-3a9083fbb0ce.png)

4. Nó sẽ tạo cho bạn một API keys coppy và dán vào file **.ENV** và Bot token bạn sẽ coppy [tại đây](https://discord.com/developers/applications) 
(Lưu ý: Bạn nào chưa biết cách tạo Bot và lấy token thì lên youtube search coi giúp mình nha 😂)
5. Vào file **index.js** bạn cần tạo một channel cho bot và sau đó coppy ID channel dán vào nếu bạn muốn bot chỉ giới hạn một channel nhất định!
(Lưu ý: Bạn nào chưa biết cách lấy ID channel thì search youtube hoặc google dùm mình luôn nha)

![image](https://cdn.discordapp.com/attachments/990995960945586250/1148529596887736320/image.png)

6. Gần như hoàn thiện, bạn chỉ cần bật terminal chạy 2 lệnh sau: `npm i` sau đó đợi nó chạy xong bạn chỉ ghi `node index.js` là hoàn thành.