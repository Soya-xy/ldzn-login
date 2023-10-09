import { QuarkElement, property, customElement, state, createRef } from "quarkc"
import style from "./index.less?inline"
import logo from './assets/logo.png'
import capbg from './assets/logo.jpg'
import banner from './assets/login-banner.png'
import { captcha } from '@ldzn/js-captcha'

declare global {
  interface HTMLElementTagNameMap {
    "ld-login": Login;
  }
}

@customElement({ tag: "ld-login", style: `${style}@unocss-placeholder` })
class Login extends QuarkElement {
  @property({ type: String }) // 外部属性
  title = ''

  @property({ type: String }) // 外部属性
  subTitle = ''

  @property({ type: Boolean }) // 外部属性
  closeCap = false

  @property({ type: String }) // 外部属性
  url = ''

  @property({ type: String }) // 外部属性
  code = ''

  @property({ type: String })
  org = ''

  @state()
  usernameError = ''

  @state()
  passwordError = ''

  @state()
  username = ''

  @state()
  password = ''

  @state()
  isLogin = false

  validation: any = createRef()

  loginServe = async () => {
    let url = ''
    if (this.url) {
      url = this.url
    }
    const res = await fetch(url + '/login/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        code: this.code,
        org: this.org,
        username: this.username,
        password: this.password,
      }),
    })

    const data = await res.json()

    if (res.status !== 200) {
      this.$emit("login", {
        detail: {
          code: res.status,
          msg: data?.message || '登录失败',
        },
      })
      return
    }

    this.$emit("login", {
      detail: {
        code: res.status,
        data: data || {},
      },
    })
  }

  login = () => {
    if (!this.username) {
      this.usernameError = '请输入账号'
    } else {
      this.usernameError = ''
    }

    if (!this.password) {
      this.passwordError = '请输入密码'
      return
    } else {
      this.passwordError = ''
    }

    this.isLogin = true
    if (!this.closeCap) {
      captcha({
        el: this.validation.current,
        width: 450,
        height: 200,
        imgSrc: capbg,
        onSuccess: () => {
          this.loginServe()
          setTimeout(() => {
            this.isLogin = false
          }, 1000)
        },
      })
    } else {
      this.loginServe()
    }
  }

  componentDidMount(): void {
    document.onkeydown = (e) => {
      if (e.key === 'Enter')
        this.login()
    }
  }


  onInput = (e, name) => {
    this[name] = e.target.value
  }

  render() {
    return (
      <>
        {this.isLogin && !this.closeCap ?
          <div class="validation">
            <div ref={this.validation} />
          </div> :
          null
        }
        <section class="min-h-screen flex text-white relative">
          <img src={logo} alt="logo" class="lg:block hidden w-1/15 h-50px absolute z-10 top-5 left-5" />
          <div class="lg:flex w-1/3 hidden bg_img relative items-center justify-center">
            <div class=" z-10 text-white">
              <h1 class="text-5xl font-bold text-left tracking-wide">{this.title}</h1>
              <p class="text-3xl my-4">{this.subTitle}</p>
              <img class="w-320px" src={banner} alt="banner" />
            </div>
          </div>
          <div class="lg:w-2/3 w-full flex items-center justify-center text-center bg-white md:px-16 px-0 z-0">
            <div class="w-full py-6 z-20">
              <h1 class="my-6 text-black text-xl">登录平台</h1>
              <div class="sm:w-2/3 w-full px-4 lg:px-0 mx-auto">
                <div class="pb-2 pt-4">
                  <input class="block w-full p-4 text-lg rounded-sm bg-[#f2f3f5] text-black" type="text" name="username" placeholder="账号" onInput={e => this.onInput(e, 'username')} value={this.username} />
                </div>

                {this.usernameError ?
                  <div class="text-red-500 text-sm text-left">{this.usernameError}</div>
                  : null}

                <div class="pb-2 pt-4">
                  <input class="block w-full p-4 text-lg rounded-sm bg-[#f2f3f5] text-black" type="password" name="password" placeholder="密码" onInput={e => this.onInput(e, 'password')} value={this.password} />
                </div>

                {this.passwordError ?
                  <div class="text-red-500 text-sm text-left">{this.passwordError}</div>
                  : null}

                <div class="px-4 pb-2 pt-4">
                  <button class="uppercase block w-full p-4 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none" onClick={this.login}>
                    <div class="flex items-center justify-center space-x-2">
                      <span>登录</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }
}
