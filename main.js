const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

    const PLAYER_STORAGE_KEY = 'F8-PLAYER'

    const cd = $('.cd');
    const heading = $('header h2');
    const cdThumb = $('.cd-thumb');
    const audio = $('#audio');
    const btnPlay = $('.btn_play');
    const btnPause = $('.btn_pause');
    const progress = $('#progress');
    const nextRight = $('.btn-next-right');
    const nextLeft = $('.btn-next-left');
    const btnRamdom = $('.btn-ramdom');
    const btnRepeat = $('.btn-repeat');
    const playlist = $('.playlist');
    const time = audio.duration;
    


const app = {
    currentIndex: 0,
    isPlaying: false,
    isRamdom: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Lửng Lơ',
            singer: 'Masew, B Ray, RedT, Ý Tiên',
            path: './css/audio/y2mate.com - Lửng Lơ  MASEW x BRAY ft RedT x Ý Tiên  MV OFFICIAL.mp3',
            image: './css/img/0.jpg',
        },
        {
            name: 'Quả Phụ Tướng',
            singer: 'DungHoangPham',
            path: './css/audio/QuaPhuTuong-DungHoangPham-8474634.mp3',
            image: './css/img/Quả Phụ Tướng.jpg',
        },
        {
            name: 'EM LÀ KẺ ĐÁNG THƯƠNG',
            singer: 'PHÁT HUY',
            path: './css/audio/y2mate.com - EM LÀ KẺ ĐÁNG THƯƠNG  PHÁT HUY T4  OFFICIAL MV.mp3',
            image: './css/img/em là kẻ đáng thương.jpg',
        },
        {
            name: 'Khi Người Mình Yêu Khóc',
            singer: 'Phan Mạnh Quỳnh ft Bùi Lan Hương',
            path: './css/audio/y2mate.com - Khi Người Mình Yêu Khóc  Phan Mạnh Quỳnh ft Bùi Lan Hương live at maylangthang (1).mp3',
            image: './css/img/khi người mình yêu.jpg',
        },
        {
            name: 'Trót Trao Duyên',
            singer: 'NB3 Hoài Bảo',
            path: './css/audio/y2mate.com - Trót Trao Duyên  NB3 Hoài Bảo  OFFICIAL MUSIC VIDEO.mp3',
            image: './css/img/Trót Trao Duyên.jpg',
        },
        {
            name: 'Luôn yêu đời',
            singer: 'Đen Vâu',
            path: './css/audio/y2mate.com - Đen  Luôn yêu đời ft Cheng MV.mp3',
            image: './css/img/Luôn Yêu Đời.jpg',
        },
        {
            name: 'Có lẽ không nên đụng đến cảm tình',
            singer: 'Mạc Khiếu Tỷ Tỷ',
            path: './css/audio/y2mate.com - 莫叫姐姐  不該用情女聲版網友評論但凡粵語標準一點都唱不出這味道動態歌詞Lyrics.mp3',
            image: './css/img/artworks-000513902004-p24rpe-t500x500.jpg',
        },
    ],

    setConfig: function(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },

    render: function() {
        const htmls = this.songs.map((song,index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''}"data-index="${index}">
                    <div class="song_box">
                        <div class="thumb"
                            style="background-image: url('${song.image}')">
                        </div>
                        <div class="playlist-body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        
                    </div>
                    <div class="option">
                        <i class="ti-more-alt"></i>
                    </div>
                </div>
                `
        });
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function() {
        const _this = this;
        const cdWidth = cd.offsetWidth

        //Sử lý CD quay / dừng
        const cdThumbAnimation = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimation.pause()

        //Sử lý phóng to thu nhỏ CD
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        const btnplaypause = $('.btn-play-pause')

        btnplaypause.onclick = () => {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }


        //Lắng nghe khi audio play
        audio.onplay = () => {
            _this.isPlaying = true;
            btnPlay.style.display = 'none';
            btnPause.style.display = 'block';
            cdThumbAnimation.play();
            _this.render();
            _this.scrollToActiveSong();
        }
        //Lắng nghe khi audio pause
        audio.onpause = () => {
            this.isPlaying = false;            
            btnPause.style.display = 'none';
            btnPlay.style.display = 'block';
            cdThumbAnimation.pause()
            _this.render();
            _this.scrollToActiveSong();
        }

        //Sử lý khi click play
        // btnPlay.onclick = function() {
        //     audio.play();
        //     audio.onplay = function() {
        //         btnPlay.style.display = 'none';
        //         btnPause.style.display = 'block';
        //     }
        // }
        //Sử lý khi click pause
        // btnPause.onclick = function() {
        //     audio.pause();
        //     audio.onpause = function() {
        //         btnPause.style.display = 'none';
        //         btnPlay.style.display = 'block';
        //     }
        // }


        //Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent;
            }
        };
        
        //Sử lý khi tua
        progress.oninput = function(e) {
            const getTimes = e.target.value * (audio.duration / 100);
            audio.currentTime = getTimes;
        }

        //Khi next song
        nextRight.onclick = function() {
            if(_this.isRamdom) {
                _this.playRamdomSong();
            } else {
                _this.nextSong();
            }
            audio.play();
        }
        nextLeft.onclick = function() {
            if(_this.isRamdom) {
                _this.playRamdomSong();
            } else {
                _this.prevSong();
            }
            audio.play();
        }
        //Bật tắt ramdom
        btnRamdom.onclick = function() {
            _this.isRamdom = !_this.isRamdom;
            _this.setConfig('isRamdom', _this.isRamdom);
            btnRamdom.classList.toggle('active', _this.isRamdom);
        }
        //Xử lý lặp lại bài nhạc
        btnRepeat.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            btnRepeat.classList.toggle('active', _this.isRepeat);
        }
        //Sử lý next song khi audio ended
        audio.onended = function () {
            if(_this.isRepeat) {
                audio.play();
            }else {
                nextRight.click();
            }
        }
        //Lắng nghe hành vi click vào list nhạc
        playlist.onclick =  function (e) {
            const songNode = e.target.closest('.song:not(.active)');
           if (songNode || e.target.closest('.option')) {
                //Xử lý khi click vào list song
                if(songNode) {
                    // console.log(songNode.getAttribute('data-index'));
                    // console.log(songNode.dataset.index);
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render;
                    audio.play();
                    
                }
                //Xử lý khi click vào option
                if(e.target.closest('.option')) {

                }
           };
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"});
        }, 300) 
    },

    loadCurrentSong: function() {

        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        
    },
    loadConfig: function() {
        this.isRamdom = this.config.isRamdom;
        this.isRepeat = this.config.isRepeat;
    },
    nextSong: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        var getLengIndex = this.songs.length;
        if(this.currentIndex == 0) {
            this.currentIndex = getLengIndex;
            this.currentIndex--;
        }else if(this.currentIndex != 0) {
            this.currentIndex--;
        }
        this.loadCurrentSong();
    },
    playRamdomSong: function() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);

        this.currentIndex = newIndex
        this.loadCurrentSong();
    },
    start: function() {
        // Gán cấu hình từ config vào ứng dụng
        this.loadConfig();

        this.defineProperties();//Định nghĩa các thuộc tính cho Object;

        this.handleEvents();//Lắng nghe sử lý các sự kiện (DOM events)

        this.loadCurrentSong();//Tải thông tin đầu tiên vào UI khi chạy ứng dụng

        this.render()//Render playlist

        //Hiển thị trạng thái ban đầu của nút Ramdom và Repeat khi lấy từ config
        btnRamdom.classList.toggle('active', this.isRamdom);
        btnRepeat.classList.toggle('active', this.isRepeat);
    }
}

app.start();

