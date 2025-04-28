<template>
    <div class="support-page">
        <!-- Hero Section -->
        <section class="hero-section support-hero" ref="heroRef" :class="{ 'visible': heroVisible }">
            <div class="container">
                <div class="hero-content">
                    <h1 class="hero-title">Hỗ trợ & Chăm sóc khách hàng</h1>
                    <p class="hero-description">G&B SPORTS luôn sẵn sàng hỗ trợ khách hàng mọi lúc mọi nơi</p>
                    <div class="hero-buttons">
                        <a-button type="primary" size="large" @click="scrollToElement('contactForm')">
                            Liên hệ ngay
                        </a-button>
                        <a-button size="large" @click="scrollToElement('faqSection')">
                            Câu hỏi thường gặp
                        </a-button>
                    </div>
                </div>
                <div class="hero-image">
                    <img src="https://nixxis.vn/wp-content/uploads/elementor/thumbs/MicrosoftTeams-image-4-qnwkxm3ijk2rvoj4dfboeakakcj5pphugunfmf18js.png"
                        alt="Chăm sóc khách hàng" />
                </div>
            </div>
        </section>

        <!-- Support Options Section -->
        <section class="support-options" ref="optionsRef" :class="{ 'visible': optionsVisible }">
            <div class="container">
                <h2 class="section-title">Chúng tôi hỗ trợ bạn bằng nhiều cách</h2>
                <div class="divider center-divider"></div>

                <div class="options-container">
                    <div class="support-option">
                        <div class="option-icon">
                            <phone-outlined />
                        </div>
                        <h3>Gọi điện</h3>
                        <p>0987 654 321</p>
                        <span class="time">(8:00 - 21:00 mỗi ngày)</span>
                    </div>

                    <div class="support-option">
                        <div class="option-icon">
                            <message-outlined />
                        </div>
                        <h3>Live Chat</h3>
                        <p>Chat trực tiếp với nhân viên</p>
                        <a-button type="primary" @click="openChat">Chat ngay</a-button>
                    </div>

                    <div class="support-option">
                        <div class="option-icon">
                            <mail-outlined />
                        </div>
                        <h3>Email</h3>
                        <p>info@gbsports.com</p>
                        <span class="time">(Phản hồi trong 24h)</span>
                    </div>

                    <div class="support-option">
                        <div class="option-icon">
                            <shop-outlined />
                        </div>
                        <h3>Cửa hàng</h3>
                        <p>Ghé thăm cửa hàng G&B SPORTS</p>
                        <a-button>Xem địa chỉ</a-button>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section class="faq-section" id="faqSection" ref="faqRef" :class="{ 'visible': faqVisible }">
            <div class="container">
                <h2 class="section-title">Câu hỏi thường gặp</h2>
                <div class="divider"></div>

                <div class="faq-categories">
                    <a-tabs>
                        <a-tab-pane key="order" tab="Đặt hàng">
                            <a-collapse accordion>
                                <a-collapse-panel header="Làm thế nào để đặt hàng trên website?" key="1">
                                    <p>Để đặt hàng trên website G&B SPORTS, bạn vui lòng thực hiện theo các bước sau:
                                    </p>
                                    <ul>
                                        <li>Tìm kiếm và chọn sản phẩm bạn muốn mua</li>
                                        <li>Chọn kích cỡ, màu sắc, số lượng và thêm vào giỏ hàng</li>
                                        <li>Kiểm tra giỏ hàng và nhấn "Thanh toán"</li>
                                        <li>Điền thông tin giao hàng và phương thức thanh toán</li>
                                        <li>Xác nhận đơn hàng</li>
                                    </ul>
                                    <p>Sau khi đặt hàng thành công, bạn sẽ nhận được email xác nhận đơn hàng.</p>
                                </a-collapse-panel>
                                <a-collapse-panel header="Tôi có thể theo dõi đơn hàng của mình không?" key="2">
                                    <p>Có, bạn có thể theo dõi đơn hàng bằng cách:</p>
                                    <ul>
                                        <li>Đăng nhập vào tài khoản của bạn trên website</li>
                                        <li>Vào mục "Đơn hàng của tôi"</li>
                                        <li>Chọn đơn hàng bạn muốn theo dõi</li>
                                    </ul>
                                    <p>Hoặc bạn có thể gọi điện thoại đến số 0987 654 321 để được hỗ trợ.</p>
                                </a-collapse-panel>
                                <a-collapse-panel header="Các phương thức thanh toán được chấp nhận?" key="3">
                                    <p>G&B SPORTS chấp nhận các phương thức thanh toán sau:</p>
                                    <ul>
                                        <li>Thanh toán khi nhận hàng (COD)</li>
                                        <li>Chuyển khoản ngân hàng</li>
                                        <li>Thẻ tín dụng/ghi nợ (Visa, MasterCard)</li>
                                        <li>Ví điện tử (Momo, ZaloPay, VNPay)</li>
                                    </ul>
                                </a-collapse-panel>
                            </a-collapse>
                        </a-tab-pane>
                        <a-tab-pane key="shipping" tab="Vận chuyển">
                            <a-collapse accordion>
                                <a-collapse-panel header="Thời gian giao hàng là bao lâu?" key="1">
                                    <p>Thời gian giao hàng phụ thuộc vào địa điểm của bạn:</p>
                                    <ul>
                                        <li>Nội thành Hà Nội, TP. HCM: 1-2 ngày làm việc</li>
                                        <li>Các tỉnh thành khác: 2-5 ngày làm việc</li>
                                        <li>Vùng sâu vùng xa: 5-7 ngày làm việc</li>
                                    </ul>
                                    <p>Lưu ý: Thời gian giao hàng có thể bị ảnh hưởng bởi điều kiện thời tiết hoặc các
                                        sự kiện bất khả kháng.</p>
                                </a-collapse-panel>
                                <a-collapse-panel header="Chi phí vận chuyển là bao nhiêu?" key="2">
                                    <p>Chi phí vận chuyển được tính dựa trên trọng lượng đơn hàng và khoảng cách giao
                                        hàng:</p>
                                    <ul>
                                        <li>Miễn phí vận chuyển cho đơn hàng từ 500.000đ</li>
                                        <li>Nội thành Hà Nội, TP. HCM: 30.000đ</li>
                                        <li>Các tỉnh thành khác: 40.000đ - 60.000đ</li>
                                    </ul>
                                    <p>Chi phí vận chuyển sẽ được hiển thị chính xác khi bạn thanh toán.</p>
                                </a-collapse-panel>
                            </a-collapse>
                        </a-tab-pane>
                        <a-tab-pane key="return" tab="Đổi trả">
                            <a-collapse accordion>
                                <a-collapse-panel header="Chính sách trả hàng như thế nào?" key="1">
                                    <p>G&B SPORTS áp dụng chính sách đổi trả trong vòng 14 ngày kể từ ngày nhận hàng,
                                        với các điều kiện sau:</p>
                                    <ul>
                                        <li>Sản phẩm còn nguyên tem mác, chưa qua sử dụng</li>
                                        <li>Còn đầy đủ bao bì, hộp đựng như ban đầu</li>
                                        <li>Có hóa đơn mua hàng hoặc phiếu giao hàng</li>
                                    </ul>
                                    <p>Chúng tôi không hỗ trợ đổi trả cho các sản phẩm đã qua sử dụng, đã giặt là hoặc
                                        có dấu hiệu hư hỏng do người dùng và khách hàng trả hàng do lý do cá nhân như 
                                        không thích, không hợp style...</p>
                                </a-collapse-panel>
                                <a-collapse-panel header="Làm thế nào để đổi hoặc trả sản phẩm?" key="2">
                                    <p>Để đổi hoặc trả sản phẩm, bạn vui lòng:</p>
                                    <ol>
                                        <li>Liên hệ với chúng tôi qua số điện thoại 0987 654 321 hoặc email
                                            info@gbsports.com</li>
                                        <li>Cung cấp thông tin đơn hàng và lý do đổi/trả</li>
                                        <li>Nhận hướng dẫn về cách thức hoàn trả sản phẩm</li>
                                       
                                    </ol>
                                    <p>Sau khi nhận được sản phẩm, chúng tôi sẽ kiểm tra và xử lý yêu cầu đổi/trả của
                                        bạn trong vòng 3-5 ngày làm việc.</p>
                                </a-collapse-panel>
                            </a-collapse>
                        </a-tab-pane>
                    </a-tabs>
                </div>
            </div>
        </section>

        <!-- Contact Form Section -->
        <section class="contact-form-section" id="contactForm" ref="contactRef" :class="{ 'visible': contactVisible }">
            <div class="container">
                <div class="contact-form-wrapper">
                    <div class="contact-info">
                        <h2 class="section-title">Thông tin liên hệ</h2>
                        <div class="divider"></div>

                        <div class="contact-item">
                            <environment-outlined />
                            <div>
                                <h4>Địa chỉ cửa hàng</h4>
                                <p>13 P. Trịnh Văn Bô, Xuân Phương, Nam Từ Liêm, Hà Nội</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <phone-outlined />
                            <div>
                                <h4>Đường dây nóng</h4>
                                <p>0987 654 321</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <mail-outlined />
                            <div>
                                <h4>Email hỗ trợ</h4>
                                <p>info@gbsports.com</p>
                            </div>
                        </div>

                        <div class="contact-item">
                            <clock-circle-outlined />
                            <div>
                                <h4>Giờ làm việc</h4>
                                <p>Thứ 2 - Chủ nhật: 8:00 - 21:00</p>
                            </div>
                        </div>

                        <div class="social-links">
                            <a href="#" class="social-link"><facebook-outlined /></a>
                            <a href="#" class="social-link"><instagram-outlined /></a>
                            <a href="#" class="social-link"><youtube-outlined /></a>
                        </div>
                    </div>

                    <div class="contact-form">
                        <h2 class="section-title">Gửi yêu cầu hỗ trợ</h2>
                        <div class="divider"></div>

                        <a-form layout="vertical">
                            <a-row :gutter="16">
                                <a-col :span="12">
                                    <a-form-item label="Họ và tên">
                                        <a-input placeholder="Nhập họ và tên" />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item label="Số điện thoại">
                                        <a-input placeholder="Nhập số điện thoại" />
                                    </a-form-item>
                                </a-col>
                            </a-row>

                            <a-form-item label="Email">
                                <a-input placeholder="Nhập địa chỉ email" />
                            </a-form-item>

                            <a-form-item label="Chủ đề">
                                <a-select placeholder="Chọn chủ đề">
                                    <a-select-option value="order">Đơn hàng</a-select-option>
                                    <a-select-option value="return">Đổi trả</a-select-option>
                                    <a-select-option value="product">Thông tin sản phẩm</a-select-option>
                                    <a-select-option value="other">Khác</a-select-option>
                                </a-select>
                            </a-form-item>

                            <a-form-item label="Nội dung">
                                <a-textarea :rows="4" placeholder="Nhập nội dung yêu cầu hỗ trợ" />
                            </a-form-item>

                            <a-form-item>
                                <a-button type="primary" html-type="submit" size="large" block>Gửi yêu cầu</a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Support Policy Section -->
        <section class="policy-section" ref="policyRef" :class="{ 'visible': policyVisible }">
            <div class="container">
                <h2 class="section-title text-center">Chính sách chăm sóc khách hàng</h2>
                <div class="divider center-divider"></div>

                <div class="policy-cards">
                    <div class="policy-card">
                        <div class="policy-icon">
                            <safety-outlined />
                        </div>
                        <h3>Bảo hành sản phẩm</h3>
                        <div class="counter-wrapper">
                            <span class="counter" data-target="365">0</span>
                            <span>ngày</span>
                        </div>
                        <p>Tất cả sản phẩm chính hãng tại G&B SPORTS đều được bảo hành theo chính sách của nhà sản xuất,
                            từ 30 đến 365 ngày tùy loại sản phẩm.</p>
                    </div>

                    <div class="policy-card">
                        <div class="policy-icon">
                            <swap-outlined />
                        </div>
                        <h3>Đổi size miễn phí</h3>
                        <p>Khách hàng được miễn phí đổi size trong vòng 15 ngày nếu sản phẩm chưa qua sử dụng và còn
                            nguyên tem mác.</p>
                    </div>

                    <div class="policy-card">
                        <div class="policy-icon">
                            <car-outlined />
                        </div>
                        <h3>Giao hàng tận nơi</h3>
                        <p>Giao hàng nhanh chóng trên toàn quốc với chi phí hợp lý. Miễn phí vận chuyển cho đơn hàng từ
                            500.000đ.</p>
                    </div>

                    <div class="policy-card">
                        <div class="policy-icon">
                            <gift-outlined />
                        </div>
                        <h3>Ưu đãi thành viên</h3>
                        <p>Trở thành thành viên để nhận nhiều ưu đãi đặc biệt, quà tặng và tích lũy điểm thưởng cho mỗi
                            lần mua hàng.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Map Section -->
        <section class="map-section" ref="mapRef" :class="{ 'visible': mapVisible }">
            <div class="container">
                <h2 class="section-title text-center">Địa điểm cửa hàng</h2>
                <div class="divider center-divider"></div>

                <div class="map-container">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4428.446608759952!2d105.74426870081332!3d21.03809188745573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x313455e940879933%3A0xcf10b34e9f1a03df!2zVHLGsOG7nW5nIENhbyDEkeG6s25nIEZQVCBQb2x5dGVjaG5pYw!5e0!3m2!1svi!2s!4v1744306375354!5m2!1svi!2s"
                        width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                </div>
            </div>
        </section>

        <!-- Live Chat Button -->
        <!-- <div class="live-chat-button">
            <a-button type="primary" shape="circle" size="large">
                <message-outlined />
            </a-button>
            <span class="live-chat-tooltip">Chat với tư vấn viên</span>
        </div> -->

        <!-- Thêm vào ngay sau thẻ div.support-page -->
        <div class="scroll-indicator"></div>
    </div>
</template>

<script setup>
import {
    PhoneOutlined,
    MessageOutlined,
    MailOutlined,
    ShopOutlined,
    EnvironmentOutlined,
    ClockCircleOutlined,
    FacebookOutlined,
    InstagramOutlined,
    YoutubeOutlined,
    SafetyOutlined,
    SwapOutlined,
    CarOutlined,
    GiftOutlined
} from '@ant-design/icons-vue';
import { ref, onMounted } from 'vue';

// Refs for sections
const heroRef = ref(null);
const optionsRef = ref(null);
const faqRef = ref(null);
const contactRef = ref(null);
const policyRef = ref(null);
const mapRef = ref(null);

// Visibility state
const heroVisible = ref(false);
const optionsVisible = ref(false);
const faqVisible = ref(false);
const contactVisible = ref(false);
const policyVisible = ref(false);
const mapVisible = ref(false);

// Scroll to element function
const scrollToElement = (elementId) => {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

function openChat() {
    emitter.emit('open-chat')
}

onMounted(() => {
    // Hiệu ứng cuộn
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target === heroRef.value) {
                if (entry.isIntersecting) {
                    heroVisible.value = true;
                    observer.unobserve(entry.target);
                }
            } else if (entry.target === optionsRef.value) {
                if (entry.isIntersecting) {
                    optionsVisible.value = true;
                    observer.unobserve(entry.target);
                }
            } else if (entry.target === faqRef.value) {
                if (entry.isIntersecting) {
                    faqVisible.value = true;
                    observer.unobserve(entry.target);
                }
            } else if (entry.target === contactRef.value) {
                if (entry.isIntersecting) {
                    contactVisible.value = true;
                    observer.unobserve(entry.target);
                }
            } else if (entry.target === policyRef.value) {
                if (entry.isIntersecting) {
                    policyVisible.value = true;
                    observer.unobserve(entry.target);
                }
            } else if (entry.target === mapRef.value) {
                if (entry.isIntersecting) {
                    mapVisible.value = true;
                    observer.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.2 });

    // Quan sát các section
    if (heroRef.value) observer.observe(heroRef.value);
    if (optionsRef.value) observer.observe(optionsRef.value);
    if (faqRef.value) observer.observe(faqRef.value);
    if (contactRef.value) observer.observe(contactRef.value);
    if (policyRef.value) observer.observe(policyRef.value);
    if (mapRef.value) observer.observe(mapRef.value);

    // Hiển thị hero section ngay khi trang load
    heroVisible.value = true;

    // Thêm hiệu ứng parallax cho hero section
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Parallax effect cho hero image
        if (heroRef.value) {
            const heroImage = heroRef.value.querySelector('.hero-image img');
            if (heroImage) {
                heroImage.style.transform = `translateY(${scrollPosition * 0.05}px)`;
            }
        }

        // Background color change on scroll
        document.querySelectorAll('section').forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition > (sectionTop - window.innerHeight / 2) &&
                scrollPosition < (sectionTop + sectionHeight - window.innerHeight / 2)) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });
    });

    // Animate numbers when scrolling to policy section
    const animateCounters = () => {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 200;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(animateCounters, 1);
            } else {
                counter.innerText = target;
            }
        });
    };

    // Thêm các counter vào trong policy section
    if (policyRef.value) {
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting) {
                animateCounters();
            }
        });
        observer.observe(policyRef.value);
    }

    // Thêm vào onMounted
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        document.querySelector('.scroll-indicator').style.width = scrolled + '%';
    });
});
</script>

<style scoped>
/* Base styles */
.support-page {
    font-family: 'Roboto', sans-serif;
    color: #111;
    background-color: white;
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 15px;
}

section {
    padding: 80px 0;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s ease, transform 0.8s ease;
}

section.visible {
    opacity: 1;
    transform: translateY(0);
}

.section-title {
    font-size: 2.5rem;
    margin-bottom: 15px;
    font-weight: 700;
    color: #000;
}

.divider {
    width: 70px;
    height: 4px;
    background-color: #e53935;
    margin-bottom: 30px;
}

.center-divider {
    margin-left: auto;
    margin-right: auto;
}

.text-center {
    text-align: center;
}

/* Hero Section */
.support-hero {
    background: linear-gradient(135deg, #fff 0%, #f5f5f5 100%);
    min-height: 550px;
    display: flex;
    align-items: center;
}

.support-hero .container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.hero-content {
    flex: 1;
    padding-right: 30px;
    min-width: 300px;
}

.hero-image {
    flex: 1;
    min-width: 350px;
    text-align: center;
}

.hero-image img {
    max-width: 150%;
    height: 350px;
    animation: floatAnimation 4s ease-in-out infinite;
}

.hero-title {
    font-size: 3.5rem;
    margin-bottom: 20px;
    color: #000;
    font-weight: 800;
    line-height: 1.2;
    font-family: 'Montserrat', sans-serif !important;
}

.hero-description {
    font-size: 1.4rem;
    margin-bottom: 30px;
    color: #333;
    line-height: 1.6;
}

.hero-buttons {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
}

@keyframes floatAnimation {
    0% {
        transform: translateY(0px);
    }

    50% {
        transform: translateY(-15px);
    }

    100% {
        transform: translateY(0px);
    }
}

/* Support Options */
.support-options {
    background-color: #f9f9f9;
    text-align: center;
}

.support-options .section-title {
    color: #000;
}

.options-container {
    display: flex;
    justify-content: center;
    gap: 30px;
    flex-wrap: wrap;
    margin-top: 40px;
}

.support-option {
    background-color: white;
    border-radius: 10px;
    padding: 30px 20px;
    width: 250px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.support-option:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(229, 57, 53, 0.25);
}

.option-icon {
    font-size: 48px;
    color: #e53935;
    margin-bottom: 20px;
}

.support-option h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #000;
    font-weight: 600;
}

.support-option p {
    color: #333;
    margin-bottom: 10px;
    font-size: 1.1rem;
}

.support-option .time {
    display: block;
    font-size: 0.95rem;
    color: #777;
    margin-bottom: 15px;
}

.visible .support-option {
    animation: fadeInUp 0.6s ease forwards;
}

.visible .support-option:nth-child(1) {
    animation-delay: 0.1s;
}

.visible .support-option:nth-child(2) {
    animation-delay: 0.2s;
}

.visible .support-option:nth-child(3) {
    animation-delay: 0.3s;
}

.visible .support-option:nth-child(4) {
    animation-delay: 0.4s;
}

/* FAQ Section */
.faq-section {
    background-color: #fff;
}

.faq-categories {
    margin-top: 30px;
}

:deep(.ant-collapse-header) {
    font-weight: 600;
    font-size: 1.1rem;
}

:deep(.ant-collapse-content-box p),
:deep(.ant-collapse-content-box li) {
    font-size: 1.05rem;
}

/* Contact Form Section */
.contact-form-section {
    background-color: #f8f8f8;
}

.contact-form-wrapper {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    margin-top: 20px;
}

.contact-info {
    flex: 1;
    min-width: 300px;
    background-color: #f9f9f9;
    padding: 35px;
    border-radius: 10px;
    color: #333;
    border: 1px solid #eee;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.contact-info .section-title {
    color: #000;
}

.contact-form {
    flex: 2;
    min-width: 300px;
    background-color: #fff;
    padding: 35px;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.contact-item {
    display: flex;
    margin-bottom: 25px;
    align-items: flex-start;
}

.contact-item .anticon {
    font-size: 24px;
    color: #e53935;
    margin-right: 15px;
    margin-top: 5px;
}

.contact-item h4 {
    margin: 0 0 5px 0;
    color: #000;
    font-size: 1.2rem;
}

.contact-item p {
    margin: 0;
    color: #555;
    font-size: 1.05rem;
}

.social-links {
    margin-top: 30px;
    display: flex;
    gap: 12px;
}

.social-link {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: 50%;
    background-color: #e53935;
    color: white;
    transition: all 0.3s ease;
    font-size: 1.2rem;
}

.social-link:hover {
    background-color: #c62828;
    transform: translateY(-5px);
}

/* Form labels và inputs lớn hơn */
:deep(.ant-form-item-label > label) {
    font-size: 1.1rem;
}

:deep(.ant-input),
:deep(.ant-select-selector),
:deep(.ant-btn) {
    font-size: 1.05rem;
}

/* Policy Section */
.policy-section {
    background-color: #fff;
    text-align: center;
    color: #333;
}

.policy-section .section-title {
    color: #000;
}

.policy-cards {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 30px;
    margin-top: 50px;
}

.policy-card {
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 12px;
    padding: 35px;
    width: 260px;
    transition: all 0.3s ease;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

.policy-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 25px rgba(229, 57, 53, 0.15);
    border-color: #e53935;
}

.policy-icon {
    font-size: 48px;
    color: #e53935;
    margin-bottom: 25px;
}

.policy-card h3 {
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #000;
    font-weight: 600;
}

.policy-card p {
    color: #555;
    line-height: 1.6;
    font-size: 1.05rem;
}

/* Map Section */
.map-section {
    padding-bottom: 0;
    background-color: white;
}

.map-container {
    margin-top: 40px;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    border: 1px solid #eee;
}

/* Live Chat Button */
.live-chat-button {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 100;
}

.live-chat-button .ant-btn {
    width: 65px;
    height: 65px;
    box-shadow: 0 5px 15px rgba(229, 57, 53, 0.3);
}

.live-chat-button .anticon {
    font-size: 28px;
}

.live-chat-tooltip {
    position: absolute;
    right: 75px;
    top: 50%;
    transform: translateY(-50%);
    background-color: #000;
    color: white;
    padding: 10px 18px;
    border-radius: 20px;
    font-size: 1rem;
    white-space: nowrap;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
}

.live-chat-button:hover .live-chat-tooltip {
    opacity: 1;
    visibility: visible;
}

/* Override Ant Design styles */
:deep(.ant-btn-primary) {
    background-color: #e53935;
    border-color: #e53935;
    font-weight: 500;
}

:deep(.ant-btn-primary:hover) {
    background-color: #c62828;
    border-color: #c62828;
}

:deep(.ant-tabs-ink-bar) {
    background-color: #e53935;
    height: 3px;
}

:deep(.ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn) {
    color: #e53935;
    font-size: 1.1rem;
    font-weight: 600;
}

:deep(.ant-tabs-tab) {
    font-size: 1.1rem;
}

:deep(.ant-tabs-tab:hover) {
    color: #e53935;
}

:deep(.ant-collapse-item:hover) {
    border-color: #e53935;
}

/* Animation */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* Responsive */
@media (max-width: 768px) {

    .hero-content,
    .hero-image {
        flex: 100%;
        padding-right: 0;
        text-align: center;
    }

    .hero-image {
        margin-top: 30px;
    }

    .hero-title {
        font-size: 2.8rem;
    }

    .section-title {
        font-size: 2.2rem;
    }

    section {
        padding: 60px 0;
    }

    .contact-info,
    .contact-form {
        flex: 100%;
    }

    .hero-buttons {
        justify-content: center;
    }
}

@media (max-width: 576px) {

    .support-option,
    .policy-card {
        width: 100%;
    }
}

/* Thêm CSS riêng cho vạch cam ở section support-options */
.support-options .divider {
    background-color: #FF5722;
    /* Màu cam */
    width: 100px;
    /* Có thể điều chỉnh độ dài */
    margin-left: auto;
    margin-right: auto;
}

/* Thêm các styles mới cho hiệu ứng cuộn */

/* Smooth scrolling cho toàn trang */
html {
    scroll-behavior: smooth;
}

/* Hiệu ứng parallax cho sections */
section {
    position: relative;
    transition: transform 0.5s ease, background-color 0.5s ease;
}

section.active-section {
    z-index: 2;
}

/* Hiệu ứng khi cuộn đến section */
.visible {
    animation: fadeInScale 0.8s ease forwards;
}

@keyframes fadeInScale {
    0% {
        opacity: 0;
        transform: scale(0.96) translateY(30px);
    }

    100% {
        opacity: 1;
        transform: scale(1) translateY(0);
    }
}

/* Hiệu ứng hover 3D cho các cards */
.support-option,
.policy-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    perspective: 1000px;
}

.support-option:hover,
.policy-card:hover {
    transform: translateY(-10px) rotateX(5deg);
    box-shadow: 0 15px 30px rgba(229, 57, 53, 0.2);
}

/* Animation cho divider */
.divider {
    position: relative;
    overflow: hidden;
}

.divider::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    animation: shine 2s infinite;
}

@keyframes shine {
    to {
        left: 100%;
    }
}

/* Hiệu ứng sóng cho các button khi hover */
:deep(.ant-btn) {
    position: relative;
    overflow: hidden;
}

:deep(.ant-btn)::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 5px;
    height: 5px;
    background: rgba(255, 255, 255, 0.5);
    opacity: 0;
    border-radius: 100%;
    transform: scale(1, 1) translate(-50%, -50%);
    transform-origin: 50% 50%;
}

:deep(.ant-btn):hover::after {
    animation: ripple 1s ease-out;
}

@keyframes ripple {
    0% {
        transform: scale(0, 0);
        opacity: 0.5;
    }

    100% {
        transform: scale(100, 100);
        opacity: 0;
    }
}

/* Hiệu ứng scroll indicator */
.scroll-indicator {
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background-color: #e53935;
    z-index: 1000;
    width: 0%;
    transition: width 0.1s ease;
}
</style>