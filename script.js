// Trạng thái nhân vật RPG
let player = {
    level: 1,
    exp: 0,
    maxExp: 100,
    money: 100,
    reputation: 10,
    maxInventory: 20,
    stock: {
        'Trà': 5,
        'Sữa': 5,
        'Trân Châu': 5,
        'Thạch': 5,
        'Matcha': 3,
        'Khoai Môn': 3
    }
};

// Danh sách Nhân vật RPG ghé thăm quán
const customersList = [
    { name: "Học Sinh Cấp 3", avatar: "🧑‍🎓", favorite: "Trà Sữa Truyền Thống", dialog: "Cho em 1 ly truyền thống thật nhiều trân châu ạ!" },
    { name: "Cô Nhân Viên IT", avatar: "👩‍💻", favorite: "Trà Sữa Matcha", dialog: "Chạy KPI mệt quá, cho chị 1 ly Matcha đậm vị nhé!" },
    { name: "Anh Gymmer", avatar: "🏋️‍♂️", favorite: "Hồng Trà Trái Cây", dialog: "Cho anh trà trái cây xịn mịn xả cân nào em!" },
    { name: "Cô Nàng Sành Điệu", avatar: "💃", favorite: "Trà Sữa Khoai Môn", dialog: "1 ly Khoai Môn Tím chuẩn gu để chụp hình check-in nha!" },
    { name: "Chú Sưu Tầm Game", avatar: "🧙‍♂️", favorite: "Trà Sữa Truyền Thống", dialog: "Ta cần nguồn năng lượng phép thuật từ Trà Sữa Truyền Thống!" }
];

const recipes = {
    'Trà Sữa Truyền Thống': { req: ['Trà', 'Sữa', 'Trân Châu'], color: '#c89666' },
    'Trà Sữa Matcha': { req: ['Trà', 'Sữa', 'Matcha'], color: '#88d49e' },
    'Trà Sữa Khoai Môn': { req: ['Trà', 'Sữa', 'Khoai Môn'], color: '#c5a3cf' },
    'Hồng Trà Trái Cây': { req: ['Trà', 'Thạch'], color: '#ff7675' }
};

let currentCustomer = null;

function updateUI() {
    document.getElementById('money').innerText = player.money;
    document.getElementById('reputation').innerText = player.reputation;
    document.getElementById('playerLevel').innerText = `Lv.${player.level}`;
    document.getElementById('currentExp').innerText = player.exp;
    document.getElementById('maxExp').innerText = player.maxExp;
    document.getElementById('expBar').style.width = `${(player.exp / player.maxExp) * 100}%`;

    let totalStock = Object.values(player.stock).reduce((a, b) => a + b, 0);
    document.getElementById('inventoryCount').innerText = totalStock;
    document.getElementById('maxInventory').innerText = player.maxInventory;

    document.getElementById('stockTea').innerText = player.stock['Trà'];
    document.getElementById('stockMilk').innerText = player.stock['Sữa'];
    document.getElementById('stockPearl').innerText = player.stock['Trân Châu'];
    document.getElementById('stockJelly').innerText = player.stock['Thạch'];
}

function log(msg) {
    let logBox = document.getElementById('logBox');
    logBox.innerHTML += `<div>[${new Date().toLocaleTimeString()}] ${msg}</div>`;
    logBox.scrollTop = logBox.scrollHeight;
}

function nextCustomer() {
    let randomIdx = Math.floor(Math.random() * customersList.length);
    currentCustomer = { ...customersList[randomIdx] };

    let avatarElem = document.getElementById('customerAvatar');
    avatarElem.innerText = currentCustomer.avatar;
    avatarElem.className = "character-avatar bounce"; // Hiệu ứng nhún nhảy

    document.getElementById('speechBubble').style.display = "block";
    document.getElementById('dialogueText').innerHTML = `<b>${currentCustomer.name}:</b> "${currentCustomer.dialog}"`;
    document.getElementById('callCustomerBtn').style.display = "none";

    log(`👤 <b>${currentCustomer.name}</b> vừa ghé quán.`);
}

function mixDrink(drinkName) {
    if (!currentCustomer) {
        alert("Chưa có khách hàng nào trong quán!");
        return;
    }

    let drink = recipes[drinkName];

    // Kiểm tra nguyên liệu
    for (let item of drink.req) {
        if ((player.stock[item] || 0) <= 0) {
            alert(` Hết nguyên liệu [${item}] rồi! Hãy mua thêm.`);
            return;
        }
    }

    // Trừ nguyên liệu
    for (let item of drink.req) {
        player.stock[item]--;
    }

    // Hiệu ứng Rót trà vào ly
    let cupFill = document.getElementById('cupFill');
    let pearls = document.getElementById('bobaPearls');
    cupFill.style.height = "85%";
    cupFill.style.backgroundColor = drink.color;
    pearls.innerText = drink.req.includes('Trân Châu') ? "⚫⚫⚫" : "🧹";
    document.getElementById('brewingStatus').innerText = `Đã pha: ${drinkName}`;

    // Xử lý phục vụ
    setTimeout(() => {
        let avatarElem = document.getElementById('customerAvatar');
        
        if (currentCustomer.favorite === drinkName) {
            avatarElem.className = "character-avatar happy-shake";
            let reward = 30;
            let expEarned = 25;

            player.money += reward;
            player.reputation += 2;
            addExp(expEarned);

            document.getElementById('dialogueText').innerHTML = `<b>${currentCustomer.name}:</b> "Ngon tuyệt vời! Cảm ơn chủ quán nhé! 😋"`;
            log(`✨ Phục vụ xuất sắc <b>${drinkName}</b>! Nhận +${reward} xu & +${expEarned} EXP.`);
        } else {
            player.money += 12;
            player.reputation = Math.max(0, player.reputation - 1);
            document.getElementById('dialogueText').innerHTML = `<b>${currentCustomer.name}:</b> "Ủa, tôi đâu gọi món này... Nhưng thôi cũng tạm được 🙄"`;
            log(`⚠️ Làm nhầm món thích của khách! Nhận ít tiền hơn.`);
        }

        // Reset sau 2 giây
        setTimeout(resetStage, 2000);
    }, 400);
}

function resetStage() {
    currentCustomer = null;
    document.getElementById('customerAvatar').innerText = "🏪";
    document.getElementById('customerAvatar').className = "character-avatar";
    document.getElementById('dialogueText').innerText = "Mời vị khách tiếp theo vào quán!";
    document.getElementById('callCustomerBtn').style.display = "block";
    
    // Reset ly trà
    document.getElementById('cupFill').style.height = "0%";
    document.getElementById('bobaPearls').innerText = "";
    document.getElementById('brewingStatus').innerText = "Ly trà sữa trống";
    updateUI();
}

function addExp(amount) {
    player.exp += amount;
    if (player.exp >= player.maxExp) {
        player.level++;
        player.exp -= player.maxExp;
        player.maxExp += 50; // Tăng yêu cầu EXP cho level tiếp theo
        log(`🎉 <b>CHÚC MỪNG!</b> Bạn đã lên cấp <b>Lv.${player.level}</b>!`);
    }
}

function buyIngredient(item, cost) {
    let totalStock = Object.values(player.stock).reduce((a, b) => a + b, 0);
    if (totalStock >= player.maxInventory) {
        alert("Kho hàng đã đầy!");
        return;
    }
    if (player.money < cost) {
        alert("Không đủ tiền!");
        return;
    }

    player.money -= cost;
    player.stock[item] = (player.stock[item] || 0) + 3;
    log(`🛒 Nhập 3 phần <b>${item}</b> (-${cost} xu).`);
    updateUI();
}

function upgradeShop() {
    if (player.money < 50) {
        alert("Bạn cần 50 xu để nâng cấp!");
        return;
    }
    player.money -= 50;
    player.maxInventory += 10;
    log(`🏰 Nâng cấp thành công! Sức chứa kho hiện tại là ${player.maxInventory}.`);
    updateUI();
}

// Khởi tạo
updateUI();