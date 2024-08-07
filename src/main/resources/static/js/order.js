/* 장바구니 항목 전체 선택 */
$(document).on('click', 'input[name=checkAll]', function(){
    for(let i=0; i < $('input[name=checkAll]').length; i++) { //2개의 전체선택 체크박스
        if($('input[name=checkAll]:checked').length != $('input[name=checkAll]').length) { //선택 또는 해제 일괄 적용
            $('input[name=checkAll]')[i].checked = true;
            $('.item').prop('checked', true);
        } else {
            $('input[name=checkAll]')[i].checked = false;
            $('.item').prop('checked', false);
            $(this).prop('checked', false);
        }
    }
});

$('.item').click(function(){
    if($('input[name=checkItem]:checked').length == $('.item').length) {
        $('.checkAll').prop('checked', true);
    } else {
        $('.checkAll').prop('checked', false);
    }
});

/* 주문서 약관 전체 선택 */
$(document).on('click', 'input[id=checkAll]', function(){
    if($('#checkAll').is(':checked')) {
        console.log('테스트');
        $('.term').prop('checked', true);
    } else {
        $('.term').prop('checked', false);
    }
});

$('.term').click(function(){
    if($('input[name=checkTerm]:checked').length == $('.term').length) {
        $('.checkAll').prop('checked', true);
    } else {
        $('.checkAll').prop('checked', false);
    }
});

/* 수량 증가 */
$(document).on('click', '.upBtn', function(){ //up 버튼
    let selectedAmount = $(this).closest('.countBox').find('input[name=selectedAmount]').val(); //input
    console.log("selectedAmount : " + selectedAmount);
    let count = parseInt(selectedAmount);
    count++;

    //클릭 시 색상 변경으로 활성화 표시
    if(count > 1) {
        $(this).closest('td').find('.downBtn').prop('disabled', false);
    }

    $(this).attr('style', 'color: #000;');
    $(this).closest('td').find('.downBtn').attr('style', 'color: #000;');
    $(this).closest('td').find('.modifyBtn').attr('style', 'color: #000; border: 1px solid #000;');

    $(this).closest('.countBox').find('input[name=selectedAmount]').val(count); //증가한 수량 대입

    //수량 증가에 따른 주문금액 반영
    let originalPrice = $(this).closest('tr').find('.prodPrice').attr('value');
    console.log(originalPrice);
    let price = parseInt(originalPrice);
    let result = count * price;
    $(this).closest('tr').find('.orderPrice').attr('value', result);
    $(this).closest('tr').find('.orderPrice').text(result.toLocaleString('ko-KR') + "원"); //원화 단위로 출력
});

/* 수량 감소 */
$(document).on('click', '.downBtn', function(){ //down 버튼
    let selectedAmount = $(this).closest('.countBox').find('input[name=selectedAmount]').val(); //input
    //console.log("selectedAmount : " + selectedAmount);
    let count = parseInt(selectedAmount);
    count--;
    if(count == 1) {
        $(this).closest('td').find('.downBtn').prop('disabled', true);
    } else {
        $(this).attr('style', 'color: #000;');
        $(this).closest('td').find('.upBtn').attr('style', 'color: #000;');
        $(this).closest('td').find('.modifyBtn').attr('style', 'color: #00008b; border: 1px solid #000;');
    }

    $(this).closest('.countBox').find('input[name=selectedAmount]').val(count); //감소한 수량 대입

    //수량 감소에 따른 주문금액 반영
    let originalPrice = $(this).closest('tr').find('.prodPrice').attr('value');
    console.log(originalPrice);
    let price = parseInt(originalPrice);
    let result = count * price;
    $(this).closest('tr').find('.orderPrice').attr('value', result);
    $(this).closest('tr').find('.orderPrice').text(result.toLocaleString('ko-KR') + "원"); //원화 단위로 출력
});

/* 수량 입력 */
$(document).on('change', 'input[name=selectedAmount]', function(){ //input 값 변경
    let selectedAmount = $(this).closest('.countBox').find('input[name=selectedAmount]').val(); //input
    let count = parseInt(selectedAmount);
    if(count > 1) {
        $(this).closest('td').find('.downBtn').prop('disabled', false);
    } else if(count == 1) {
        $(this).closest('td').find('.downBtn').prop('disabled', true);
    }

    $(this).closest('td').find('.upBtn').attr('style', 'color: #000;');
    $(this).closest('td').find('.downBtn').attr('style', 'color: #000;');
    $(this).closest('td').find('.modifyBtn').attr('style', 'color: #000; border: 1px solid #000;');

    //수량 입력에 따른 주문금액 반영
    let originalPrice = $(this).closest('tr').find('.prodPrice').attr('value');
    console.log(originalPrice);
    let price = parseInt(originalPrice);
    let result = count * price;
    $(this).closest('tr').find('.orderPrice').attr('value', result);
    $(this).closest('tr').find('.orderPrice').text(result.toLocaleString('ko-KR') + "원"); //원화 단위로 출력
});

/* 수량 변경사항 저장 */
$(document).on('click', '.modifyBtn', function(){ //modify 버튼
    let selectedAmount = $(this).closest('tr').find('input[name=selectedAmount]').val(); //input
    let optionNo = $(this).closest('tr').find('.option-area').attr('value');
    console.log(optionNo);

    let param = { quantity : selectedAmount, optionNo : optionNo };

    $.ajax({
        url : '/cart/mycart/modify',
        type: 'post',
        data : JSON.stringify(param),
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        success : function(result){
            Swal.fire({
                icon: 'success',
                title: '수량 변경이 완료되었습니다',
                confirmButtonColor: '#00008b',
                confirmButtonText: '확인'
            }).then((result) => {
                if(result.isConfirmed) {
                    window.location.reload(); //페이지 새로고침
                    window.history.scrollRestoration = 'manual'; //스크롤 최상단 고정
                }
            })
        },
        error : function(status, error){ console.log(status, error); }
    });
});

/* 선택 상품 행 삭제 */
$(document).on('click', '.deleteBtn', function(){ //delete 버튼
    let optionNo = $(this).closest('tr').find('.option-area').attr('value');

    let param = { optionNo : optionNo };

    $.ajax({
        url : '/cart/mycart/delete',
        type: 'post',
        data : JSON.stringify(param),
        beforeSend : function(xhr) {
            xhr.setRequestHeader("Accept", "application/json");
            xhr.setRequestHeader("Content-Type", "application/json");
        },
        success : function(result){
            Swal.fire({
                icon: 'success',
                title: '선택 상품이 삭제되었습니다',
                confirmButtonColor: '#00008b',
                confirmButtonText: '확인'
            }).then((result) => {
                if(result.isConfirmed) {
                    window.location.reload(); //페이지 새로고침
                    window.history.scrollRestoration = 'manual'; //스크롤 최상단 고정
                }
            })
        },
        error : function(status, error){ console.log(status, error); }
    });
});

/* 선택 상품 목록 삭제 */
$(document).on('click', '.button-delete', function(){ //delete 버튼
    let checkbox = $('input[name=checkItem]:checked');
    let optionNo = 0;
    let arr = new Array();
    //1-1. 전체목록 중 선택한 옵션번호 저장
    checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        optionNo = td.eq(2).attr('value');
        console.log(optionNo);
        arr.push(optionNo);
    });
    //1-2. 선택된 체크박스가 없는 경우
    if(arr.length == 0) {
        Swal.fire({
            icon: 'warning',
            title: '1개 이상의 상품을 체크하세요',
            confirmButtonColor: '#00008b',
            confirmButtonText: '확인'
        }).then((result) => {
            if(result.isConfirmed) {
                history.go(0); //현재 페이지 새로고침
            }
        })
    }

    $.ajax({
        url : '/cart/mycart/deleteAll',
        type : 'post',
        traditional : true, //배열 넘기기 위한 세팅
        dataType : 'text',
        data : { arr : arr },
        success : function(result){
            Swal.fire({
                icon: 'success',
                title: '선택 상품이 삭제되었습니다',
                confirmButtonColor: '#00008b',
                confirmButtonText: '확인'
            }).then((result) => {
                if(result.isConfirmed) {
                    window.location.reload(); //페이지 새로고침
                    window.history.scrollRestoration = 'manual'; //스크롤 최상단 고정
                }
            })
        },
        error : function(status, error){ console.log(status, error); }
    });
});

/* 선택 상품 찜하기 */
function addToWishList() { //wish 버튼
    let checkbox = $('input[name=checkItem]:checked');
    let optionNo = "";
    let arr = new Array();
    //1-1. 전체목록 중 선택한 옵션번호 저장
    checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        optionNo = td.eq(2).attr('value');
        console.log(optionNo);
        arr.push(optionNo);
    });
    //1-2. 선택된 체크박스가 없는 경우
    if(arr.length == 0) {
        Swal.fire({
            icon: 'warning',
            title: '1개 이상의 상품을 체크하세요',
            confirmButtonColor: '#00008b',
            confirmButtonText: '확인'
        }).then((result) => {
            if(result.isConfirmed) {
                history.go(0); //현재 페이지 새로고침
            }
        })
        //1-3. 로그인 여부 확인
    } else if(arr.length > 0 && !document.getElementById('isLoggedInAs')) {
        Swal.fire({
            icon: 'warning',
            title: '로그인이 필요합니다',
            confirmButtonColor: '#00008b',
            confirmButtonText: '확인'
        }).then((result) => {
            if(result.isConfirmed) {
                location.href='/member/signin';
            }
        })
    } else {
        $.ajax({
            url : '/mypage/wishlist/add',
            type : 'post',
            traditional : true, //배열 넘기기 위한 세팅
            dataType : 'text',
            data : { wishListOptionNo : arr },
            success : function(result){
                if(result == '성공') {
                    Swal.fire({
                        icon: 'success',
                        title: '찜하기가 완료되었습니다',
                        confirmButtonColor: '#00008b',
                        confirmButtonText: '확인'
                    }).then((result) => {
                        if(result.isConfirmed) {
                            window.location.reload(); //페이지 새로고침
                            window.history.scrollRestoration = 'manual'; //스크롤 최상단 고정
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: '이미 찜하기 목록에 존재하는 상품입니다',
                        confirmButtonColor: '#00008b',
                        confirmButtonText: '확인'
                    }).then((result) => {
                        if(result.isConfirmed) {
                            window.location.reload(); //페이지 새로고침
                            window.history.scrollRestoration = 'manual'; //스크롤 최상단 고정
                        }
                    })
                }
            },
            error : function(status, error){ console.log(status, error); }
        });
    }
};

/* 장바구니 합계 */
let link = document.location.href;
//console.log(link);
if(link.indexOf('order') == -1) { //주소값에 order를 포함하지 않은 경우에 한하여 적용
    let quantity = 0;

    /* 합계A. 상품금액 */
    let prodPrice = document.querySelectorAll('.origPrice');
    let orderPrice = 0;
    //console.log(prodPrice);
    for(let i=0; i < prodPrice.length; i++) {
        quantity = prodPrice[i].parentElement.parentElement.children[4].children[0].children[1].value; //선택수량
        //console.log(prodPrice[i].attributes.value.textContent); //NodeList에서 value 추출
        orderPrice += (parseInt(prodPrice[i].attributes.value.textContent) * quantity); //int 타입으로 변환
        //console.log(orderPrice);
    }

    /* 합계B. 할인금액 */
    let discounts = document.querySelectorAll('del');
    let discounted = document.querySelectorAll('.discounted');
    let sellingPrice = 0;
    let savingPrice = 0;
    for(let i=0; i < discounts.length; i++) { //할인상품 개수만큼 반복
        quantity = discounts[i].parentElement.parentElement.children[4].children[0].children[1].value; //선택수량
        sellingPrice += (parseInt(discounts[i].attributes.value.textContent) * quantity); //상품금액 총합
        savingPrice +=(parseInt(discounted[i].attributes.value.textContent) * quantity); //할인적용금액 총합
    }
    let discountAmount = sellingPrice - savingPrice; //총 상품금액 - 총 할인적용금액 = 할인금액

    /* 합계C. 배송비(업체별 묶음배송) */
    let brand = document.querySelectorAll('.brand');
    let deliveries = document.querySelectorAll('.delivery');
    let deliveryFee = 0;
    let brandSet = new Set();
    for(let i=0; i < brand.length; i++) { //업체 총 개수
        brandSet.add(brand[0].innerHTML);
        if(brand[0].innerHTML != brand[i].innerHTML) brandSet.add(brand[i].innerHTML);
    }

    let iteratorSet = brandSet.values(); //Set 또는 Map에 담긴 values를 불러오기 위해서는 iterator 활용
    let priceMap = new Map();
    for(let i=0; i < brandSet.size; i++) {
        priceMap.set(iteratorSet.next().value, 0);
    }
    let iteratorMapA = priceMap.keys();
    for(let i=0; i < priceMap.size; i++) {
        let key = iteratorMapA.next().value;
        let value = 0;
        deliveries.forEach(function(item){
            let checkPrice = item.parentElement.children[5].attributes.value.textContent; //cellIndex 통해 불러오기
            let checkBrand = item.parentElement.children[6].innerHTML;
            if(key == checkBrand) { //Map의 key 값과 브랜드명이 일치하는 경우 업체별 주문금액 합산
                value += parseInt(checkPrice);
                priceMap.set(key, value);
                //console.log(value);
            }
        });
    }
    console.log(priceMap); //업체별 총 주문금액
    let cost = 0;
    let iteratorMapB = priceMap.keys();
    let isCheckedBrand = new Map();
    for(let i=0; i < priceMap.size; i++) {
        let key = iteratorMapB.next().value;
        isCheckedBrand.set(key, false);
        deliveries.forEach(function(item){
            //조건1. 일부 브랜드는 2만원 이상일 때 무료 배송하며 기본금 상이
            if(key == '모나미') { cost = priceMap.get(key) >= 20000 ? 0 : 3000;
                //조건2. 기본 3만원 이상 주문 시 무료 배송
            } else { cost = priceMap.get(key) >= 30000 ? 0 : 2500; }
            let checkBrand = item.parentElement.children[6].innerHTML;
            if(key == checkBrand) {
                item.parentElement.children[7].innerHTML = cost.toLocaleString('ko-KR') + "원"; //원화 단위로 출력
                item.parentElement.children[7].attributes.value = cost;
                //console.log(item.parentElement.children);
                console.log(isCheckedBrand.get(key));
                if(!isCheckedBrand.get(key)) { //업체별 묶음배송
                    deliveryFee += parseInt(item.parentElement.children[7].attributes.value); //배송비 총합
                    isCheckedBrand.set(key, true);
                }
            }
        });

        /* 합계 반영 */
        let totalPrice = orderPrice - discountAmount + deliveryFee;
        document.querySelector('.order-price').innerHTML = orderPrice.toLocaleString('ko-KR');
        document.querySelector('.discount-amount').innerHTML = discountAmount.toLocaleString('ko-KR');
        document.querySelector('.delivery-fee').innerHTML = deliveryFee.toLocaleString('ko-KR');
        document.querySelector('.total-price').innerHTML = totalPrice.toLocaleString('ko-KR');
    }
} else { //주소값에 order를 포함한 경우 적용
    /* 주문서 배송비 */
    let brand = document.querySelectorAll('.brand');
    let deliveries = document.querySelectorAll('.delivery');
    let deliveryFee = 0;
    let brandSet = new Set();
    for(let i=0; i < brand.length; i++) { //업체 총 개수
        brandSet.add(brand[0].innerHTML);
        if(brand[0].innerHTML != brand[i].innerHTML) brandSet.add(brand[i].innerHTML);
    }

    let iteratorSet = brandSet.values(); //Set 또는 Map에 담긴 values를 불러오기 위해서는 iterator 활용
    let priceMap = new Map();
    for(let i=0; i < brandSet.size; i++) {
        priceMap.set(iteratorSet.next().value, 0);
    }
    let iteratorMapA = priceMap.keys();
    for(let i=0; i < priceMap.size; i++) {
        let key = iteratorMapA.next().value;
        let value = 0;
        deliveries.forEach(function(item){
            let checkPrice = item.parentElement.children[4].attributes.value.textContent; //cellIndex 통해 불러오기
            let checkBrand = item.parentElement.children[5].innerHTML;
            if(key == checkBrand) { //Map의 key 값과 브랜드명이 일치하는 경우 업체별 주문금액 합산
                value += parseInt(checkPrice);
                priceMap.set(key, value);
                //console.log(value);
            }
        });
    }
    console.log(priceMap); //업체별 총 주문금액
    let cost = 0;
    let iteratorMapB = priceMap.keys();
    for(let i=0; i < priceMap.size; i++) {
        let key = iteratorMapB.next().value;
        deliveries.forEach(function(item){
            //조건1. 일부 브랜드는 2만원 이상일 때 무료 배송하며 기본금 상이
            if(key == '모나미') { cost = priceMap.get(key) >= 20000 ? 0 : 3000;
                //조건2. 기본 3만원 이상 주문 시 무료 배송
            } else { cost = priceMap.get(key) >= 30000 ? 0 : 2500; }
            let checkBrand = item.parentElement.children[5].innerHTML;
            if(key == checkBrand) {
                item.parentElement.children[6].innerHTML = cost.toLocaleString('ko-KR') + "원"; //원화 단위로 출력
                item.parentElement.children[6].attributes.value = cost;
                //console.log(item.parentElement.children);
                deliveryFee += parseInt(item.parentElement.children[6].attributes.value); //배송비 총합
            }
        });
    }
    /* 결제 정보 */
    /* 합계A. 주문금액 */
    let totalPrice = document.querySelectorAll('.orderPrice');
    let totalOrderAmount = 0;
    for(let i=0; i < totalPrice.length; i++) {
        totalOrderAmount += (parseInt(totalPrice[i].attributes.value.textContent));
        console.log(totalOrderAmount);
    }

    /* 합계B. 결제금액(주문금액 + 배송비 - 적립금) */
    let reserveToUse = $('input[name=reserve]').val();
    let paymentAmount = totalOrderAmount + deliveryFee - reserveToUse;
    console.log(paymentAmount);

    document.querySelector('.order-amount').innerHTML = totalOrderAmount.toLocaleString('ko-KR') + '원';
    document.querySelector('.delivery-fee').innerHTML = deliveryFee.toLocaleString('ko-KR') + '원';
    document.querySelector('.payment-amount').innerHTML = paymentAmount.toLocaleString('ko-KR');
    document.querySelector('.payment-amount').attributes.value = paymentAmount;
}

/* 적립금 적용 */
function applyReserve() {
    let reserveUsed = $('input[name=reserve]').val(); //적립금

    let A = document.querySelector('.order-amount').innerHTML.replace(',', '').slice(0, -1); //맨 뒤에 '원' 단위 제거
    let B = document.querySelector('.delivery-fee').innerHTML.replace(',', '').slice(0, -1);
    let amountBefore = parseInt(A) + parseInt(B); //주문금액 + 배송비
    console.log(amountBefore);
    let amountAfter = parseInt(amountBefore - reserveUsed.replace(',', '')); //연산 위해 콤마 제거
    console.log(amountAfter);
    document.querySelector('.reserve-used').innerHTML = reserveUsed.toLocaleString('ko-KR') + '원';
    document.querySelector('.payment-amount').innerHTML = amountAfter.toLocaleString('ko-KR');
    document.querySelector('.payment-amount').attributes.value = amountAfter;
}

/* 장바구니 단일 상품 주문 */
let buttonClicked;
let tr;
for(const item of document.querySelectorAll('.orderBtn')) {
    item.addEventListener('click', function(event){
        buttonClicked = event.target;
        console.log(buttonClicked);
        tr = event.target.parentElement.parentElement.parentElement; //행 기준으로 탐색

        let optionNo = "";
        optionNo = tr.children[2].attributes.value.textContent;
        console.log(optionNo);

        $.ajax({
            url : '/cart/order',
            type: 'get',
            data : { optionNo : optionNo },
            success : function(result){
                console.log('주문페이지 이동');
                location.href='/cart/order';
            },
            error : function(status, error){ console.log(status, error); }
        });
    });
}

/* 장바구니 선택 또는 전체 상품 주문 */
function orderAll() {
    let checkbox = $('input[name=checkItem]');
    let optionNo = "";
    let arr = new Array();
    checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        optionNo = td.eq(2).attr('value');
        console.log(optionNo);
        arr.push(optionNo);
    });
    $.ajax({
        url : '/cart/order',
        type : 'get',
        traditional : true, //배열 넘기기 위한 세팅
        dataType : 'text',
        data : { arr : arr },
        success : function(result){
            console.log('주문페이지 이동');
            location.href='/cart/order';
        },
        error : function(status, error){ console.log(status, error); }
    });
}

function orderSelection() {
    let checkbox = $('input[name=checkItem]:checked');
    let optionNo = "";
    let arr = new Array();
    //1-1. 전체목록 중 선택한 옵션번호 저장
    checkbox.each(function(i){
        let tr = checkbox.parent().parent().eq(i);
        let td = tr.children();
        optionNo = td.eq(2).attr('value');
        console.log(optionNo);
        arr.push(optionNo);
    });
    //1-2. 선택된 체크박스가 없는 경우
    if(arr.length == 0) {
        Swal.fire({
            icon: 'warning',
            title: '1개 이상의 상품을 체크하세요',
            confirmButtonColor: '#00008b',
            confirmButtonText: '확인'
        }).then((result) => {
            if(result.isConfirmed) {
                history.go(0); //현재 페이지 새로고침
            }
        })
        //1-3. 주문(로그인 여부 확인 포함)
    } else {
        $.ajax({
            url : '/cart/order',
            type : 'get',
            traditional : true, //배열 넘기기 위한 세팅
            dataType : 'text',
            data : { arr : arr },
            success : function(result){
                console.log('주문페이지 이동');
                location.href='/cart/order';
            },
            error : function(status, error){ console.log(status, error); }
        });
    }
};


/* 주문자 정보 가져오기 */
$('.check').click(function(){
    let name = $('input[name=hiddenName]').val();
    let phone = $('input[name=hiddenPhone]').val();
    let memberAddress = $('input[name=hiddenAddress]').val();
    let addressArr = memberAddress.split('$');
    let postalCode = addressArr[0];
    let address = addressArr[1];
    let detailAddress = addressArr[2];

    if($('.check').is(':checked')) {
        $('input[name=rcvrName]').val(name);
        $('input[name=rcvrPhone]').val(phone);
        $('input[name=postalCode]').val(postalCode);
        $('input[name=address]').val(address);
        $('input[name=detailAddress]').val(detailAddress);
    } else {
        $('input[name=rcvrName]').val('');
        $('input[name=rcvrPhone]').val('');
        $('input[name=postalCode]').val('');
        $('input[name=address]').val('');
        $('input[name=detailAddress]').val('');
    }
});

/* 옵션 드롭다운 */
$('.dropdown').on('click', function() {
    $('.dropdown').not($(this)).removeClass('open');
    $(this).toggleClass('open');
    if ($(this).hasClass('open')){
        $(this).find('.option').attr('tabindex', 0);
        $(this).find('.selected').focus();
    } else {
        $(this).find('.option').removeAttr('tabindex');
        $(this).focus();
    }
});

/* 드롭다운 옵션 선택 시 */
$('.dropdown .option').on('click', function() {
    let text = $(this).data('display-text') || $(this).html();
    $(this).closest('.dropdown').find('.current').html(text); //선택값 반영

    if(text == '직접 입력') {
        $('#typeOwnMessage').prop('hidden', false);
    } else {
        $('#typeOwnMessage').prop('hidden', true);
    }
});

/* Modal */
$('.interest-free-detail').on('click', function(){
    $('#interest-free').modal('show');
    return false;
});

/* Login 확인 */
function isLoggedIn(){
    if(document.getElementById('isLoggedInAs')) {
        console.log('존재함');
    } else {
        Swal.fire({
            icon: 'warning',
            title: '로그인이 필요합니다',
            confirmButtonColor: '#00008b',
            confirmButtonText: '확인'
        }).then((result) => {
            if(result.isConfirmed) {
                location.href='/member/signin';
            }
        })
        return;
    }
}