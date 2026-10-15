(() => {
  const VERSION = '0.5.21-integrated-launcher';
  if (window.__switchHome?.version === VERSION && window.__switchHome.status().mounted) return window.__switchHome.status();
  window.__switchHome?.dispose();
  const recentSectionClass = window.__shfsClasses?.gamepadhome_RecentSection_39tNv || '_39tNvaLedsTrVh0fFsP4Jm';
  const section = document.querySelector('.' + CSS.escape(recentSectionClass));
  if (!section) return { waiting: 'Steam HOME carousel' };
  const item = section.querySelector('[role="listitem"]') || section;
  let fiber = item[Object.keys(item).find(k => k.startsWith('__reactFiber$'))];
  let carousel;
  for (let depth = 0; fiber && depth < 40; depth++, fiber = fiber.return) {
    if (fiber.stateNode?.GetCellColumnWidth) { carousel = fiber.stateNode; break; }
  }
  if(!carousel){
    const start=section[Object.keys(section).find(k=>k.startsWith('__reactFiber$'))];
    const pending=[start];let count=0;
    while(pending.length&&count++<3000){const node=pending.pop();if(!node)continue;if(node.stateNode?.GetCellColumnWidth){carousel=node.stateNode;break;}for(let c=node.child;c;c=c.sibling)pending.push(c);}
  }
  if (!carousel || Object.hasOwn(carousel, 'render')) throw Error('Unsupported Steam HOME component');
  const shared = carousel.render.constructor('return globalThis')();
  let requireSteam;
  shared.webpackChunksteamui.push([[`shfs-${Date.now()}`], {}, r => { requireSteam = r; }]);
  const React = requireSteam(63696);
  const Panel = requireSteam(38850).Z;
  const getNavigator = requireSteam(32951).lF;
  const app = requireSteam(5757).oy;
  const gamepad = requireSteam(20505).pR;
  const NotificationIcon = requireSteam(69385).Notifications;
  const useUnreadNotifications = requireSteam(7474).Xm;
  const notificationTab = requireSteam(7284).qE.Notifications;
  const useQuickAccessMenu = requireSteam(7284).uT;
  const useHistory = requireSteam(49519).W6;
  const searchRoute = requireSteam(72500).BV.GamepadUI.Search.Tab('All');
  const SearchIcon = requireSteam(69385).Search;
  const profileImage = document.querySelector('#header_profile img.avatar')?.src;
  let downloadStore = null;
  let friendStore = null;
  try {
    downloadStore = requireSteam(55426).hj;
    window.__shfsDownloadStore = downloadStore;
  } catch {}
  try {
    friendStore = requireSteam(55239)?.xm?.FriendStore || null;
    window.__shfsFriendStore = friendStore;
  } catch {}
  if (!React?.createElement || !Panel || !getNavigator) throw Error('Unsupported Steam navigation modules');
  const h = React.createElement;
  const scrollAreaClass = window.__shfsClasses?.gamepadhome_ScrollArea_3PhGY || '_3PhGYbMWIcIaZCfllWN19N';
  const scrollArea = section.closest('.' + CSS.escape(scrollAreaClass));
  const hidden = [];
  if (scrollArea) for (const child of scrollArea.children) {
    if (child === section || child.contains(section)) continue;
    hidden.push({ child, display: child.style.display, inert: child.inert });
    child.style.display = 'none'; child.inert = true;
  }
  const headerClock = [...document.querySelectorAll('#header > div')].find(element => /^\d{1,2}:\d{2}$/.test(element.textContent.trim()));
  headerClock?.classList.add('shfs-native-clock');
  const state = {
    version: VERSION, stage: 'full', selected: null, actionsVisible: getComputedStyle(document.documentElement).getPropertyValue('--shfs-actions-visible').trim() !== '0',
    status: () => ({ version: VERSION, stage: state.stage, selected: state.selected, mounted: !!document.getElementById('shfs-home'), route: location.pathname }),
    readDownloads() {
      if (!downloadStore) return { available: false, label: 'ダウンロード情報なし', percent: 0, active: false };
      try {
        const overview = downloadStore.LocalDownloadOverview || downloadStore.CurrentViewingDownloadOverview;
        const transfers = downloadStore.AllTransfers || [];
        const queued = downloadStore.QueuedTransfers || [];
        const active = Number(overview?.update_appid) > 0 || transfers.some(value => value?.active);
        const paused = !!overview?.paused || queued.some(value => value?.paused);
        const percent = Math.max(0, Math.min(100, Number(overview?.overall_percent_complete ?? 0)));
        return { available: true, active, paused, percent, queued: queued.length, label: active ? 'ダウンロード中' : paused ? '一時停止' : '待機中' };
      } catch { return { available: false, label: 'ダウンロード情報なし', percent: 0, active: false }; }
    },
    readFriends() {
      if (!friendStore) return { available: false, friendCount: 0, onlineCount: 0, playingCount: 0, label: 'フレンド情報待ち' };
      try {
        const friends = (friendStore.all_friends || []).filter(Boolean);
        const online = friends.filter(friend => friend.persona?.is_online);
        const playing = online.filter(friend => friend.persona?.is_ingame);
        const game = playing[0]?.current_game_name || '';
        const avatars = online.map((friend, index) => ({
          key: friend.persona?.avatar_url_medium || friend.persona?.avatar_url_full || String(index),
          src: friend.persona?.avatar_url_medium || friend.persona?.avatar_url_full || '',
          playing: !!friend.persona?.is_ingame,
          game: friend.persona?.is_ingame ? friend.current_game_name || '' : ''
        })).filter(friend => friend.src).sort((a, b) => Number(b.playing) - Number(a.playing));
        const label = friends.length === 0 ? 'フレンドなし'
          : playing.length ? `${playing.length}人プレイ中${game ? ` · ${game}` : ''}`
          : online.length ? `オンライン ${online.length}人` : `フレンド ${friends.length}人 · オフライン`;
        return { available: true, friendCount: friends.length, onlineCount: online.length, playingCount: playing.length, avatars, label };
      } catch { return { available: false, friendCount: 0, onlineCount: 0, playingCount: 0, avatars: [], label: 'フレンド情報待ち' }; }
    },
    sync() {
      const visible = getComputedStyle(document.documentElement).getPropertyValue('--shfs-actions-visible').trim() !== '0';
      if (visible !== state.actionsVisible) { state.actionsVisible = visible; carousel.forceUpdate(); }
      return state.status();
    },
    setStage(stage) { state.stage = stage; carousel.forceUpdate(); },
    closeMenus() { app.CloseSideMenus(); },
    dispose() {
      delete carousel.render;
      for (const { child, display, inert } of hidden) { child.style.display = display; child.inert = inert; }
      headerClock?.classList.remove('shfs-native-clock');
      delete window.__shfsControllerSupport;
      delete window.__shfsControllerSupportDebug;
      delete document.documentElement.dataset.shfsHome;
      if (scrollArea) scrollArea.scrollTop = 0;
      if (section.isConnected) carousel.setState({nContainerWidth:section.clientWidth});
      delete window.__switchHome;
    }
  };
  function Home() {
    const history = useHistory();
    const unreadNotifications = useUnreadNotifications();
    const openNotifications = useQuickAccessMenu(notificationTab);
    const rowRef = React.useRef(null);
    const actionNavRefs = React.useRef({});
    const gameNavRefs = React.useRef({});
    const headerNavRefs = React.useRef({ profile:{current:null}, search:{current:null}, notifications:{current:null} });
    const lastGameSelection = React.useRef(null);
    const scrollMotion = React.useRef({ target: null, at: 0 });
    const [selected, setSelected] = React.useState(state.selected);
    const [gameTitles, setGameTitles] = React.useState({});
    const [squareArt, setSquareArt] = React.useState({});
    const checkedSquareArt = React.useRef(new Set());
    const readSize = () => {
      const probe = document.createElement('div');
      probe.style.cssText = 'position:fixed;visibility:hidden;width:var(--shfs-icon-size,20vw);height:1px;';
      document.body.appendChild(probe);
      const value = Math.min(parseFloat(getComputedStyle(probe).width) || innerWidth * .20, innerHeight * .36);
      probe.remove();
      return Math.round(value);
    };
    const [size, setSize] = React.useState(readSize);
    const [download, setDownload] = React.useState(state.readDownloads());
    const [friends, setFriends] = React.useState(state.readFriends());
    React.useEffect(() => {
      const resize = () => setSize(readSize());
      addEventListener('resize', resize); return () => removeEventListener('resize', resize);
    }, []);
    React.useEffect(() => {
      const refresh = () => setDownload(state.readDownloads());
      refresh(); const timer = setInterval(refresh, 1000);
      return () => clearInterval(timer);
    }, []);
    React.useEffect(() => {
      const refresh = () => setFriends(state.readFriends());
      refresh(); const timer = setInterval(refresh, 5000);
      return () => clearInterval(timer);
    }, []);
    React.useLayoutEffect(() => {
      document.documentElement.dataset.shfsHome = 'true';
      if (scrollArea) scrollArea.scrollTop = 0;
      if (rowRef.current && selected == null) rowRef.current.scrollLeft = 0;
      return () => {
        delete document.documentElement.dataset.shfsHome;
        if (rowRef.current) rowRef.current.scrollLeft = 0;
      };
    }, []);
    const revealCardAtEdge = (row, card) => {
      if (!row || !card) return;
      const rowRect = row.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const css = getComputedStyle(row);
      const leftEdge = rowRect.left + (parseFloat(css.paddingLeft) || 0);
      const rightEdge = rowRect.right - (parseFloat(css.paddingRight) || 0);
      const edgeTolerance = 16;
      let delta = 0;
      if (cardRect.right > rightEdge + edgeTolerance) delta = cardRect.right - rightEdge;
      else if (cardRect.left < leftEdge - edgeTolerance) delta = cardRect.left - leftEdge;
      if (!delta) return;
      const maxScroll = Math.max(0, row.scrollWidth - row.clientWidth);
      const target = Math.max(0, Math.min(maxScroll, row.scrollLeft + delta));
      const now = performance.now();
      const previousMoveStillRunning = scrollMotion.current.target != null && Math.abs(row.scrollLeft - scrollMotion.current.target) > 2;
      const isRapidMove = now - scrollMotion.current.at < 220;
      const behavior = previousMoveStillRunning || isRapidMove ? 'auto' : 'smooth';
      row.scrollTo({
        left: target,
        behavior
      });
      scrollMotion.current = { target: behavior === 'smooth' ? target : null, at: now };
    };
    const clampSelectedTitle = () => {
      const card = rowRef.current?.querySelector(`[data-shfs-app="${selected}"]`);
      const title = card?.querySelector('.shfs-game-title');
      if (!card || !title || !title.textContent.trim()) return;
      title.style.left = '0px';
      const titleRect = title.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const overflow = titleRect.right - (innerWidth - 32);
      if (overflow > 0) title.style.left = `${Math.max(32 - cardRect.left, -overflow)}px`;
    };
    React.useLayoutEffect(() => {
      const row = rowRef.current;
      const card = row?.querySelector(`[data-shfs-app="${selected}"]`);
      revealCardAtEdge(row, card);
      clampSelectedTitle();
    }, [selected, size, gameTitles]);
    function focus(appid) {
      lastGameSelection.current = appid;
      state.selected = appid; setSelected(appid);
    }
    function clearGameSelection() {
      state.selected = null;
      if (selected !== null) setSelected(null);
    }
    const games = [];
    for (let index = 0; index < carousel.props.nNumItems; index++) {
      const native = carousel.props.fnItemRenderer(index, size, size + 52, 0);
      if (!native || native.props.appid === 0) continue;
      const appid = native.props.appid;
      if (!appid) continue; // Real library action is provided on the lower rail.
      const navRef = gameNavRefs.current[appid] ||= { current: null };
      const squareSource = squareArt[appid];
      const cardWidth = squareSource ? size : Math.round(size * 2 / 3);
      games.push(h('div', { key: appid, className: 'shfs-game', 'data-shfs-app': appid,
        'data-shfs-art': squareSource ? 'square' : 'portrait', style: { width: cardWidth, height: size, '--shfs-card-width': `${cardWidth}px` } },
        h('div', { className: `shfs-game-title${appid === selected && gameTitles[appid] ? ' is-visible' : ''}`, 'aria-live': appid === selected ? 'polite' : undefined },
          h('span', { className:'shfs-game-title-text' }, appid === selected ? gameTitles[appid] || '' : '')),
        React.cloneElement(native, { navRef, bFeatured: false, bShortLayout: false, label: undefined, nWidth: cardWidth, nHeight: size + 52, nLeft: 0,
          bScrollIntoViewOnFocus: false, showAsHovered: false, onItemFocus: focus, onItemHover: undefined })));
    }
    const gameIds = games.map(game => game.props['data-shfs-app']).join(',');
    React.useEffect(() => {
      const titles = {};
      const supportByApp = {};
      for (const card of rowRef.current?.querySelectorAll('.shfs-game') || []) {
        const appid = card.dataset.shfsApp;
        const labelIds = card.querySelector('[aria-labelledby]')?.getAttribute('aria-labelledby')?.split(/\s+/) || [];
        const title = labelIds
          .map(id => document.getElementById(id)?.textContent?.trim())
          .find(Boolean);
        if (appid && title) titles[appid] = title;
        let fiber = card[Object.keys(card).find(key => key.startsWith('__reactFiber$'))];
        const pending = [fiber]; let app = null; let visited = 0;
        while (pending.length && visited++ < 200) {
          fiber = pending.pop();
          if (!fiber) continue;
          if (fiber.memoizedProps?.app?.appid === Number(appid)) { app = fiber.memoizedProps.app; break; }
          for (let child = fiber.child; child; child = child.sibling) pending.push(child);
        }
        if (appid && app) {
          supportByApp[appid] = Number(app.xbox_controller_support) || 0;
          card.dataset.shfsControllerSupport = String(supportByApp[appid]);
        }
      }
      window.__shfsControllerSupport = supportByApp;
      if (Object.keys(titles).length) setGameTitles(current => ({ ...current, ...titles }));
    }, [gameIds]);
    React.useEffect(() => {
      let cancelled = false;
      const cards = [...(rowRef.current?.querySelectorAll('.shfs-game') || [])];
      const imageListeners = [];
      for (const card of cards) {
        const appid = Number(card.dataset.shfsApp);
        const currentImage = card.querySelector('img');
        if (currentImage?.naturalWidth > 0 && currentImage.naturalWidth === currentImage.naturalHeight) {
          setSquareArt(current => current[appid] ? current : { ...current, [appid]: 'original-square' });
          continue;
        }
        const markOriginalSquare = () => {
          if (currentImage?.naturalWidth > 0 && currentImage.naturalWidth === currentImage.naturalHeight) {
            setSquareArt(current => current[appid] ? current : { ...current, [appid]: 'original-square' });
          }
        };
        if (currentImage) {
          currentImage.addEventListener('load', markOriginalSquare);
          imageListeners.push([currentImage, markOriginalSquare]);
        }
        let node = card[Object.keys(card).find(key => key.startsWith('__reactFiber$'))];
        const pending = [node]; let app = null; let visited = 0;
        while (pending.length && visited++ < 200) {
          node = pending.pop();
          if (!node) continue;
          if (node.memoizedProps?.app?.appid === appid) { app = node.memoizedProps.app; break; }
          for (let child = node.child; child; child = child.sibling) pending.push(child);
        }
        const iconHash = app?.icon_hash;
        const key = `${appid}:${iconHash || ''}`;
        if (!iconHash || !/^[a-f0-9]{40}$/i.test(iconHash) || checkedSquareArt.current.has(key)) continue;
        checkedSquareArt.current.add(key);
        const probe = new Image();
        probe.onload = () => {
          if (cancelled || probe.naturalWidth !== probe.naturalHeight || probe.naturalWidth < 128) return;
          const src = probe.src;
          setSquareArt(current => current[appid] === src ? current : { ...current, [appid]: src });
        };
        probe.src = `https://steamloopback.host/assets/${appid}/${iconHash}.jpg`;
      }
      return () => {
        cancelled = true;
        for (const [image, handler] of imageListeners) image.removeEventListener('load', handler);
      };
    }, [gameIds]);
    React.useLayoutEffect(() => {
      for (const [appid, src] of Object.entries(squareArt)) {
        if (src === 'original-square') continue;
        const image = rowRef.current?.querySelector(`[data-shfs-app="${appid}"] img`);
        if (image && image.src !== src) image.src = src;
      }
    }, [squareArt, selected, size, download, friends]);
    const actions = state.stage === 'full' && state.actionsVisible ? [
      ['user', 'フレンド', () => getNavigator().Chat()],
      ['news', 'ニュース', () => getNavigator().SteamWeb('https://store.steampowered.com/news/')],
      ['store', 'ストア', () => getNavigator().SteamWeb('https://store.steampowered.com/')],
      ['album', 'アルバム', () => getNavigator().Media.Grid({ state: { filter: { listSource: { type: 'recents' }, mediaType: 'screenshot' } } })],
      ['controller', 'コントローラー', () => getNavigator().Settings('Controller', 'menu')],
      ['settings', '設定', () => getNavigator().Settings('System')],
      ['library', 'ライブラリ', () => getNavigator().LibraryTab('AllGames')],
      ['power', '電源', () => app.OpenPowerMenu(null)]
    ] : [];
    const icon = kind => {
      const paths = {
        user: ['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M4 22v-3a8 6 0 0 1 16 0v3'],
        news: ['M5.5 4.5h15A1.5 1.5 0 0 1 22 6v12a1.5 1.5 0 0 1-1.5 1.5h-5.8L13 21.3l-1.7-1.8H5.5A1.5 1.5 0 0 1 4 18V6a1.5 1.5 0 0 1 1.5-1.5Z','M4 13h18M7 16.5h5'],
        store: ['M5 9h16l1 13H4z','M10 12V5h6v7'],
        album: ['M3 5.5h20v15H3z','M7 18.5v-5a3.5 3.5 0 0 1 7 0v2a2.5 2.5 0 0 1 5 0v3Z'],
        // Trace the official HOME mark's asymmetrical contour directly, with a
        // straight upper edge and rounded lower/outer end.
        controller: ['M4.4 16.7 16.8 4.3l3.5 3.5c1.8 1.8 1.8 3.5 0 5.3l-8.5 8.5c-1.8 1.8-3.7 1.8-5.5 0l-2.2-2.2c-.8-.8-.8-1.8 0-2.7Z'],
        settings: ['M13 7a6 6 0 1 0 0 12 6 6 0 0 0 0-12','M13 3v4M13 19v4M3 13h4M19 13h4M5.9 5.9l2.9 2.9M17.2 17.2l2.9 2.9M20.1 5.9l-2.9 2.9M8.8 17.2l-2.9 2.9'],
        library: ['M3 4h5v17H3zM10 4h5v17h-5zM17 5l4-1 3 16-4 1z'],
        power: ['M12 2v10','M6 5a9 9 0 1 0 12 0']
      };
      const shapes = paths[kind].map((d,i) => h('path', {key:i,d}));
      return h('svg', { viewBox: '0 0 26 26', 'aria-hidden': true },
        kind === 'controller'
          ? h('g', null, ...shapes,
            h('circle', { key:'stick', cx:11.2, cy:16.2, r:1.3, fill:'currentColor', stroke:'none' }),
            ...[[15.0,9.8],[17.6,9.8],[15.0,12.4],[17.6,12.4]].map(([cx,cy],i)=>h('circle',{key:`button-${i}`,cx,cy,r:'0.67',fill:'currentColor',stroke:'none'})))
          : shapes);
    };
    const focusAction = kind => {
      clearGameSelection();
      const handle = actionNavRefs.current[kind]?.current;
      if (handle?.TakeFocus) handle.TakeFocus();
      else if (handle?.ChildTakeFocus) handle.ChildTakeFocus();
    };
    const focusGame = () => {
      const id = lastGameSelection.current || state.selected || selected || games[0]?.props?.['data-shfs-app'];
      const handle = gameNavRefs.current[id]?.current;
      if (handle?.TakeFocus) handle.TakeFocus();
      else if (handle?.ChildTakeFocus) handle.ChildTakeFocus();
    };
    const moveDown = event => {
      if (event.detail?.button === gamepad.DIR_DOWN && actions.length) { focusAction('user'); return true; }
      return false;
    };
    const focusHeader = kind => {
      clearGameSelection();
      headerNavRefs.current[kind]?.current?.TakeFocus();
    };
    const headerDirection = (kind,event) => {
      const button=event.detail?.button, order=['profile','search','notifications'], index=order.indexOf(kind);
      if(button===gamepad.DIR_DOWN){focusGame();return true;}
      if(button===gamepad.DIR_UP)return true;
      if(button===gamepad.DIR_LEFT){focusHeader(order[Math.max(0,index-1)]);return true;}
      if(button===gamepad.DIR_RIGHT){focusHeader(order[Math.min(order.length-1,index+1)]);return true;}
      return false;
    };
    return h(Panel, { id: 'shfs-home', className: 'shfs-home', 'flow-children': 'column', focusable: false,
      style: { '--shfs-card': `${size}px` },
      onGamepadDirection: moveDown },
      h(Panel, { id:'shfs-profile', className:'shfs-profile', role:'button', 'aria-label':'ユーザー情報', navRef:headerNavRefs.current.profile,
        focusable:true, onFocus:clearGameSelection, onGamepadDirection:event=>headerDirection('profile',event),
        onActivate:()=>getNavigator().Account(), onOKActionDescription:'ユーザー情報を開く' },
        h('img',{src:profileImage,alt:'',draggable:false})),
      h(Panel, { id:'shfs-search', className:'shfs-search', role:'button', 'aria-label':'検索', navRef:headerNavRefs.current.search,
        focusable:true, onFocus:clearGameSelection, onGamepadDirection:event=>headerDirection('search',event),
        onActivate:()=>history.push(searchRoute), onOKActionDescription:'検索を開く' }, h(SearchIcon)),
      h(Panel, { id:'shfs-notifications', className:'shfs-notifications', role:'button', 'aria-label':'通知を表示', navRef:headerNavRefs.current.notifications,
        'data-unread':unreadNotifications || 0, focusable:true, onFocus:clearGameSelection,
        onGamepadDirection:event=>headerDirection('notifications',event),
        onActivate:openNotifications, onOKActionDescription:'通知を開く' },
        h(NotificationIcon, { alert:unreadNotifications > 0 })),
      h('div', {className:'shfs-friend-avatars', 'aria-label':`オンラインのフレンド ${friends.onlineCount}人`},
        ...friends.avatars.slice(0, 4).map(friend => h('span', {key:friend.key, className:`shfs-friend-avatar ${friend.playing ? 'is-playing' : ''}`, title:friend.playing ? `${friend.game}をプレイ中` : 'オンライン'},
          h('img', {src:friend.src, alt:'', draggable:false}))),
        friends.avatars.length > 4 ? h('span', {className:'shfs-friend-avatar-overflow'}, `+${friends.avatars.length - 4}`) : null),
      h('div', {className:`shfs-friend-status ${!friends.available ? 'is-unavailable' : friends.friendCount === 0 ? 'is-empty' : friends.onlineCount > 0 ? 'is-online' : 'is-offline'}`, role:'status', 'aria-label':friends.label},
        h('svg', {viewBox:'0 0 24 24', 'aria-hidden':true},
          h('circle',{cx:'8',cy:'8',r:'3'}), h('circle',{cx:'17',cy:'9',r:'2.5'}),
          h('path',{d:'M2.5 19c0-3 2.2-5 5.5-5s5.5 2 5.5 5M14 15c.8-.7 1.7-1 2.9-1 2.7 0 4.6 1.7 4.6 4.5'})),
        h('span', {className:'shfs-friend-label'}, friends.label)),
      h('div', {className:'shfs-download-status', role:'status', 'aria-label':`${download.label} ${Math.round(download.percent)}%`},
        h('div', {className:'shfs-download-label'}, download.label),
        h('div', {className:'shfs-download-track'}, h('span', {className:'shfs-download-fill', style:{width:`${download.active ? download.percent : 0}%`}})),
        h('div', {className:'shfs-download-percent'}, download.active ? `${Math.round(download.percent)}%` : download.queued ? `${download.queued}件待機` : '—')),
      h(Panel, { className:'shfs-games', 'flow-children':'row', focusable:false, ref:rowRef, navEntryPreferPosition:1, onScroll:clampSelectedTitle,
        onGamepadDirection: event => {
          if(event.detail?.button===gamepad.DIR_UP){focusHeader('profile');return true;}
          if(event.detail?.button===gamepad.DIR_DOWN&&actions.length){focusAction('user');return true;}
          return false;
        } }, ...games),
      actions.length ? h(Panel, {className:'shfs-actions', 'flow-children':'row', focusable:false,
        onGamepadDirection: event => event.detail?.button === gamepad.DIR_UP ? (focusGame(), true) : false}, ...actions.map(([kind,label,activate]) => {
        const navRef = actionNavRefs.current[kind] ||= { current: null };
        return h(Panel, {key:kind, navRef, className:`shfs-action shfs-${kind}`, role:'button', 'aria-label':label, focusable:true, onFocus:clearGameSelection, onActivate:activate, onOKActionDescription:'開く'},
          icon(kind), h('span',{className:'shfs-action-label'},label));
      })) : null);
  }
  Object.defineProperty(carousel, 'render', { configurable: true, writable: true, value() { return h(Home); } });
  window.__switchHome = state;
  carousel.forceUpdate();
  return state.status();
})()
