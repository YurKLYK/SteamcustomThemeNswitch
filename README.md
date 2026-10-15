# Switch Home for Steam

Windows版Steam Big Pictureを、Nintendo SwitchのHOMEメニューに近い配置へ変更する非公式テーマです。ダークモード、横並びのゲーム、シアン色の選択枠、丸い下部メニュー、左上のユーザーとフレンド、右上の時計・Wi-Fi・ダウンロード進捗・検索・通知を表示します。

**CSSLoader DesktopとNode.jsの両方が必要です。CSSだけのテーマではありません。** Steamのゲームカード・画面遷移を使い、別のランチャーアプリは作りません。ゲームやSteam本体の実行ファイルは変更しません。

## 必要なもの

| ソフト | 入手先・用途 |
| --- | --- |
| Windows 10 / 11、Steamデスクトップクライアント | [Steam公式](https://store.steampowered.com/about/)・新Big Pictureを使用 |
| CSSLoader Desktop | [公式Releases](https://github.com/DeckThemes/CSSLoader-Desktop/releases/latest)・テーマ設定とCSS注入 |
| Node.js 24 LTS以降 | [Node.js公式](https://nodejs.org/en/download)・HOMEを復元する小さな常駐処理 |

Windowsへの導入にGit、Python、npmパッケージ、Steam Deck、Decky Loaderは不要です。キーボード・マウスでも操作できます。

## いちばん簡単な導入：CMDひとつだけ

1. Steamを導入してログインします。
2. [Releases](https://github.com/YurKLYK/SteamcustomThemeNswitch/releases/latest)のAssetsから`Setup.cmd`だけをダウンロードして実行します。同梱フォルダーは不要です。
3. CMDが同じリリースのテーマをGitHubから取得・展開します。Node.js 24以降がなければwingetで公式LTSを導入し、CSSLoader Desktopがなければ[公式MSI](https://github.com/DeckThemes/CSSLoader-Desktop/releases/latest)を取得してインストーラーを開きます。Windowsの許可画面やインストーラーは内容を確認して進めてください。wingetがないPCではNode.jsを手動導入して再実行します。
4. CSS・JSが`%USERPROFILE%\homebrew\themes\Switch Home for Steam`へ自動配置され、ヘルパーのログイン時起動とデスクトップショートカットが登録されます。
5. CSSLoader Desktopを開き、初回はBackendをInstallします。テーマを再読み込みし、`Switch Home for Steam`を有効化、`Color Scheme`を`Dark`にします。この操作は自動化していません。
6. デスクトップの`Switch Home for Steam`からBig Pictureを開きます。

ネット接続が必要です。CMDは固定バージョンを取得するので、更新時は新しいリリースのCMDを使ってください。失敗時は赤いエラーと失敗メッセージを表示し、完了とは表示しません。ダウンロードはWindowsの一時フォルダーに残ります（診断用）。ハッシュ確認用の`SHA256SUMS.txt`もリリースに添付します。新規PCでのNode.js/MSI導入全体は未検証です。

以下は手動導入・トラブル対応用の詳しい手順です。

## 1. Steamを準備

1. Steamをインストールし、自分のアカウントでログインします。
2. Steam右上のBig Pictureボタン、または「表示」→「Big Pictureモード」を開きます。
3. HOMEに「最近プレイ」のゲーム列があることを確認します。最近起動したゲームがない場合は、一度手持ちのゲームを起動して終了してください。
4. 初回導入中は、ほかのHOMEレイアウト変更テーマを無効にしてください。

## 2. CSSLoader Desktopをインストール

1. [公式Releases](https://github.com/DeckThemes/CSSLoader-Desktop/releases/latest)を開きます。
2. 「Assets」からWindows用の`.msi`をダウンロードします。`.msi.zip`ならZIPを展開してから中のMSIを実行します。Linux用AppImageは選びません。
3. インストーラーに従って導入し、CSSLoader Desktopを起動します。
4. 初回にBackendのインストールを求められたら「Install」を選びます。Backendも動いている必要があります。
5. Steamへの接続を確認します。必要ならCSSLoaderのSettingsからBackendを起動し、Steamを完全終了して起動し直します。

出典：[CSSLoader Desktop公式導入手順](https://github.com/DeckThemes/CSSLoader-Desktop#installation)。アプリ更新で表記が変わった場合は公式手順を優先してください。本テーマ自身は画像・フォントを同梱しません。カスタム画像・フォントを使う別テーマも導入する場合は、公式READMEの「Creating Symlink」を参照してください。

## 3. Node.jsをインストール

1. [Node.js公式ダウンロード](https://nodejs.org/en/download)からLTS版のWindowsインストーラーを取得します。通常のIntel/AMD PCはx64版です。
2. 標準設定で導入し、PATHへの追加を有効にします。本テーマに追加ビルドツールは不要です。
3. 開いているPowerShellを閉じ、新しく開いて次を実行します。

   ```powershell
   node --version
   ```

4. `v24...`以上が出れば準備完了。「nodeが見つからない」ならPowerShellを開き直すかNode.jsのPATH設定を確認します。

## 4. テーマをダウンロード・配置

1. [このリポジトリ](https://github.com/YurKLYK/SteamcustomThemeNswitch)の「Code」→「Download ZIP」を選びます。
2. ZIPを右クリック→「すべて展開」。ZIP内から直接スクリプトを実行しないでください。
3. 展開先で`theme.json`、`README.md`、`runtime`、`options`があるフォルダーを見つけます。
4. そのフォルダー名を`Switch Home for Steam`にして、以下へコピーします。`homebrew`や`themes`がなければ作成します。

   ```text
   %USERPROFILE%\homebrew\themes\Switch Home for Steam
   ```

5. 次の構造か確認します。フォルダーの二重入れに注意してください。

   ```text
   homebrew\themes\Switch Home for Steam\
   ├── theme.json
   ├── shared.css
   ├── home.css
   ├── menus.css
   ├── options\
   └── runtime\
       ├── install.ps1
       ├── uninstall.ps1
       ├── startup.vbs
       ├── watch-home.mjs
       ├── native-home.js
       └── home.css
   ```

エクスプローラーのアドレスバーへ`%USERPROFILE%\homebrew\themes`を貼り付けると移動できます。CSSLoader側でテーマ保存先を変えている場合は、この標準配置先と一致させてください。

## 5. HOMEヘルパーを登録

簡単に導入する場合は`Setup.cmd`をダブルクリックしてください。CMD単体でもリリースからテーマを再取得し、依存ソフトの確認・導入とCSS配置を実行します。手動配置済みでダウンロードをせず登録する場合は、以下の`runtime\install.ps1`を使ってください。

以後はこのショートカットを開くだけで、ヘルパーとSteam Big Pictureを一緒に起動できます。ヘルパーが動いていれば再利用するため、ショートカットを繰り返し開いても増えません。初回のテーマ有効化は手順6で行います。

通常権限のPowerShellで次を実行します。テーマスクリプトに管理者権限は不要です。

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\homebrew\themes\Switch Home for Steam\runtime\install.ps1"
```

`Bypass`はこのプロセスだけに適用され、PC全体の実行ポリシーを恒久変更しません。管理されたPCで実行が禁止されている場合は管理者に確認してください。

このスクリプトはNode.jsを確認し、必要なテーマファイルを標準配置先へコピーして、Node.jsパスをローカル専用の`runtime/node-path.txt`へ保存します。ユーザーのWindowsスタートアップに`Switch Home for Steam.vbs`を登録し、同じテーマの古いヘルパーを終了して、新しいヘルパーを非表示で起動します。Node.jsを移動・再インストールした場合は、このコマンドをもう一度実行してください。

## 6. CSSLoaderで有効化

1. CSSLoader Desktopでローカルテーマを再読み込みします。必要なら`Refresh Injector`を実行します。
2. `Switch Home for Steam`を有効にします。
3. `Color Scheme`を`Dark`にします（初期値もDark）。
4. Big PictureのHOMEを開き、1～2秒待ちます。
5. プロフィール・ゲーム列・下の丸ボタン・右上の検索とベルが出れば導入完了です。

CSSLoaderにテーマが出なければ`theme.json`の場所を確認してください。**CSSLoaderで無効にするだけではヘルパーは停止しません。** 完全に標準へ戻す方法は下のアンインストール手順を参照してください。

## 7. ローカルデバッグ接続を確認

ヘルパーはSteamのCEFデバッグ接続`http://127.0.0.1:8080/json`を使います。CSSLoader導入後もテーマが動かない場合に確認してください。

1. Big Picture起動中にブラウザーで上記URLを開き、JSON一覧に`Big Picture`を含む項目があるか確認します。
2. 接続できなければSteamを通知領域のアイコンから完全終了します。ウィンドウを閉じるだけでは終了していない場合があります。
3. Steamショートカットを右クリック→「プロパティ」。リンク先の実行ファイルの引用符の**後ろ**に半角スペースと`-cef-enable-debugging`を追加します。

   ```text
   "C:\Program Files (x86)\Steam\steam.exe" -cef-enable-debugging
   ```

4. そのショートカットからSteamとBig Pictureを起動し、接続を確認します。別の自動起動経路ではその引数が使われない場合があります。

起動オプションは[Valveの資料](https://developer.valvesoftware.com/wiki/Command_line_options#Steam)も参照してください。ポート8080をインターネットに公開したり、ルーターでポート転送したりする必要はありません。

## 操作

| 操作 | 動作 |
| --- | --- |
| ゲーム列で←→ | ゲーム選択。表示範囲の端を越えると横スクロール |
| ゲーム列で↑ | 左上のユーザー情報へ |
| 上段で←→ | ユーザー情報・検索・通知を移動 |
| 上段で↓ | 最後に選んだゲームへ戻る |
| ゲーム列で↓ / 下部で↑ | ゲーム列と下部メニューを往復 |
| Enter / 決定ボタン | 選択した機能を開く |
| Esc / 戻るボタン | Steam標準の戻る操作 |

左上の自分アイコンはユーザー情報、下の人型はフレンドリストです。フレンドのアバター列と中央のプレイ状況は表示専用。ベルは未読0件でも表示します。

| 下部メニュー | 開くSteam機能 |
| --- | --- |
| 人型 | フレンドリスト |
| ニュース | Steamニュース |
| ストア | Steamストア |
| アルバム | スクリーンショットで絞り込んだメディア一覧 |
| Joy-Con風 | コントローラー設定 |
| 歯車 | Steam設定 |
| ライブラリ | すべてのゲーム |
| 電源 | Steamの電源メニュー（即座にPCを終了しません） |

## 見た目の設定

CSSLoaderのテーマ設定で`Color Scheme`（Dark/Light）、`Selection Color`、`Background Color`、`Game Icon Size`、`Game Icon Gap`、`Bottom Menu`を変更できます。反映しなければ`Refresh Injector`を実行してください。仕上げと表示確認はDarkを基準にしており、Lightは一部アイコンの色などに差があります。

CSSを直接調整する場合は`runtime/home.css`と`options/`を編集し、手順5を再実行してヘルパーも再起動します。

## PC起動時にBig Pictureへ入る

専用ショートカットは、Steamが停止中ならデバッグ引数付きでBig Pictureを起動し、すでに起動中ならSteamのBig Picture起動URIを使います。すでに動いているSteamに後からデバッグ引数は適用できないため、その場合はSteamを完全終了してショートカットから起動し直してください。Steamやゲームを自動で強制終了する処理はありません。

通常のSteamからBig Pictureへ入る場合も、Windowsログイン時のヘルパーが待機していれば適用されます。専用ショートカットを使わず、ログイン時のヘルパーも止めている場合に、Steamの通常ボタンだけから外部JSを自動起動する仕組みではありません。CSSLoader Backendの起動・テーマ有効化は別途必要です。

Steam設定の「インターフェイス」内でWindowsログイン時のSteam起動とBig Picture起動を有効にします（項目名はバージョンで変わる場合あり）。CSSLoader Desktop / Backendの自動起動もCSSLoader側で設定してください。ヘルパーはWindowsログイン時に起動し、Steamが利用可能になるまで待ちます。

## 更新

新しいZIPを展開し、テーマファイルを標準配置先へ上書きした後、手順5のコマンドを再実行します。これでヘルパーも更新・再起動されます。続いてCSSLoaderで`Refresh Injector`を実行しHOMEを開き直してください。`runtime/node-path.txt`やログを配布・共有する必要はありません。

## 困ったとき

| 症状 | 確認 |
| --- | --- |
| 標準HOMEのまま | Node.js、ヘルパー、ポート8080、最近プレイ欄を確認 |
| テーマ一覧にない | `themes\Switch Home for Steam\theme.json`か確認 |
| 再起動すると動かない | Node.jsを固定の場所へ導入しinstall.ps1を再実行。`shell:startup`にVBSがあるか確認 |
| 設定が反映されない | 有効化、Refresh Injector、ほかのHOMEテーマとの競合を確認 |
| スクショ一覧が空 | Steamのスクショがあるか、画面内フィルターを確認。外部アプリの画像は自動取込されません |
| ゲーム画像が縦長 | 高解像度正方形アートがない場合は、切らずに縦長を使う仕様 |
| Steam更新後に動かない | 内部APIの追従修正が必要な場合あり。ログとSteam/CSSLoaderの版を確認 |

ログは次で確認できます。共有前に個人パスなどが含まれていないか確認してください。

```powershell
Get-Content "$env:USERPROFILE\homebrew\themes\Switch Home for Steam\runtime\watch-home.log" -Tail 30
```

読み取り専用の導入チェックも用意しています。ダウンロードしたテーマのルートから実行してください。

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/check-environment.ps1
```

## 無効化・アンインストール

1. PowerShellでヘルパーと自動起動登録を停止します。

   ```powershell
   powershell.exe -NoProfile -ExecutionPolicy Bypass -File "$env:USERPROFILE\homebrew\themes\Switch Home for Steam\runtime\uninstall.ps1"
   ```

2. CSSLoaderで本テーマを無効にし、`Refresh Injector`を実行します。
3. Steamを完全終了して起動し直します。すでに開いているHOMEに残った変更も解除されます。
4. 不要なら`%USERPROFILE%\homebrew\themes\Switch Home for Steam`だけをエクスプローラーから削除します。ゲームやSteamのuserdataは削除しません。
5. 自分でショートカットへデバッグ引数を足し、ほかのツールで使っていなければ、その引数も取り除けます。

## 仕組み・制約・確認状況

- CSSLoaderが配色と設定を管理。Node.jsヘルパーは約0.9秒ごとにローカルSteamを確認し、HOMEで既存ReactカードとPanelを組み直します。別画面では解除し、HOMEへ戻ると再適用します。
- npmライブラリ、独自バックエンド、任天堂の画像やフォントは同梱しません。Steamのゲームアート・アバターと独自SVG図形を使用します。
- Steam内部React構造・モジュール番号・APIに依存する実験的テーマです。Steam更新やBeta版で修正が必要になる可能性があります。
- Windows 10/11向けに設計。手元のWindows Big Picture / 約1920×1080の16:9で実画面確認しましたが、全Windows版・全解像度の検証ではありません。
- 上段への矢印移動、ユーザー情報・検索のEnter決定、ゲーム列への復帰はSteamレンダラーへのキー入力で確認。物理コントローラーの全操作・ゲームの実起動は未検証です。
- フレンド、通知、アカウント、スクショ一覧への遷移は実画面確認済み。確認時のスクショ一覧は空で、多数の画像がある状態は未検証です。
- 正方形アートは128px以上のものがある場合に優先。ない場合は縦長カバーを切らずに表示します。
- ダウンロード中ゲームアイコンの専用位置は実装済みですが、位置変更後の実ダウンロード中表示は未確認です。
- Nintendo / Valveの公式製品ではなく、提携もありません。

## 開発・Steam更新への修正

主な編集先は`runtime/native-home.js`（画面・操作）、`runtime/home.css`（見た目）、`theme.json`（CSSLoader設定）です。CSSLoaderの`css_translations.json`を使いますが、Steamモジュール番号やDOMの意味までは自動修復しません。

壊れた場合はヘルパーを停止して標準HOMEへ戻し、実DOM・Computed Style・Steam内部接続先を調査してから修正してください。変更ごとに実画面を撮って比較します。

PowerShell 7での構成チェック：

```powershell
node --check runtime/native-home.js
node --check runtime/watch-home.mjs
pwsh -NoProfile -File tools/validate-theme.ps1
```

配布ZIPの作成（PowerShell 5.1以降）：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File tools/build-package.ps1
```

`dist/`にテーマ名フォルダー入りZIPを作成します。ローカルの検証画像・ログ・PC専用設定は含めません。

## 参考資料

- [Nintendo公式 HOME Menu Overview](https://www.nintendo.com/au/support/articles/home-menu-overview/)
- [Nintendo公式 Joy-Conサポート](https://support.nintendo.com/jp/switch/controller/joycon.html)
- [CSSLoaderドキュメント](https://docs.deckthemes.com/)
- [変更履歴](CHANGELOG.md)

公開版にはアカウントやフレンドの写った開発中スクリーンショットは含めていません。
