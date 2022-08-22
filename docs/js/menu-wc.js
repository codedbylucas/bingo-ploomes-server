'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">bingo-ploomes-server documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                        <li class="link">
                            <a href="changelog.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>CHANGELOG
                            </a>
                        </li>
                        <li class="link">
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                        <li class="link">
                            <a href="todo.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>TODO
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' : 'data-target="#xs-controllers-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' :
                                            'id="xs-controllers-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' : 'data-target="#xs-injectables-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' :
                                        'id="xs-injectables-links-module-AppModule-33a3795ba7907f861e113241e2335cf440aa582c5b2c7057f23c7346239291fbb91e2dfeb9ab6ae87bd0600d6a8809b04f25f4286e4d7c24d08deb8093f9ecb9"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' : 'data-target="#xs-controllers-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' :
                                            'id="xs-controllers-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' : 'data-target="#xs-injectables-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' :
                                        'id="xs-injectables-links-module-AuthModule-af21a4255676e296e43dfeeef3b355280d9db506f5605882ef9b2a2cf2a35c53183a98266b33780cc724ec3ca497de3ba2a6fad8b1c181f9882c3dfb337c093e"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CardModule.html" data-type="entity-link" >CardModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CardModule-ac0ae5cc14cfbda28b6ec53e8564c1b0d7d1bd0d9e1ac1046dfcc6206d765edc94c65bc0ef774a2db468aaadd316f5cd8eb9f0fbd2e6ce42244b8df8f6df9787"' : 'data-target="#xs-injectables-links-module-CardModule-ac0ae5cc14cfbda28b6ec53e8564c1b0d7d1bd0d9e1ac1046dfcc6206d765edc94c65bc0ef774a2db468aaadd316f5cd8eb9f0fbd2e6ce42244b8df8f6df9787"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CardModule-ac0ae5cc14cfbda28b6ec53e8564c1b0d7d1bd0d9e1ac1046dfcc6206d765edc94c65bc0ef774a2db468aaadd316f5cd8eb9f0fbd2e6ce42244b8df8f6df9787"' :
                                        'id="xs-injectables-links-module-CardModule-ac0ae5cc14cfbda28b6ec53e8564c1b0d7d1bd0d9e1ac1046dfcc6206d765edc94c65bc0ef774a2db468aaadd316f5cd8eb9f0fbd2e6ce42244b8df8f6df9787"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PrismaModule.html" data-type="entity-link" >PrismaModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' : 'data-target="#xs-injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' :
                                        'id="xs-injectables-links-module-PrismaModule-8a45c52f5bc506f9fcef1f4c7b34e596b06323bae0951c4fe354cc2b76489f6abcf1207439120a4bd3a6cf40174b139cda70f7a558a3f53d9bcdd3a9e74b81bf"' }>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoomModule.html" data-type="entity-link" >RoomModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' : 'data-target="#xs-controllers-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' :
                                            'id="xs-controllers-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' }>
                                            <li class="link">
                                                <a href="controllers/RoomController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' : 'data-target="#xs-injectables-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' :
                                        'id="xs-injectables-links-module-RoomModule-45bfaf311ed1a370f5006795159396ed66c6ec6151c2543faaf0e7ddf1fb296ef21f09d907c52676e44bcacdcb3ec2986d25775b0d8d16c59e786366771e1081"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RoomUserModule.html" data-type="entity-link" >RoomUserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' : 'data-target="#xs-controllers-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' :
                                            'id="xs-controllers-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' }>
                                            <li class="link">
                                                <a href="controllers/RoomUserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomUserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' : 'data-target="#xs-injectables-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' :
                                        'id="xs-injectables-links-module-RoomUserModule-0540ad37f30ee8710ba1dc5ec3abc2b2872f97eb0d39e18ae540a06be9cce03ae8089eff7c2868216506552d9bb8db246d148955c477c7d17143f7ee5743f06a"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/PrismaService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PrismaService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' : 'data-target="#xs-controllers-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' :
                                            'id="xs-controllers-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' }>
                                            <li class="link">
                                                <a href="controllers/UserController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' : 'data-target="#xs-injectables-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' :
                                        'id="xs-injectables-links-module-UserModule-82b152184450c83b0493a1fa0671b3f59f4a7654b5de1509a68e8c88150908fca04a1398d503051840914a62e39a74b38037db324e5b20cadf26fcb857d01727"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CardService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CardService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/RoomUserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >RoomUserService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UserService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#controllers-links"' :
                                'data-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoomController.html" data-type="entity-link" >RoomController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/RoomUserController.html" data-type="entity-link" >RoomUserController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/UserController.html" data-type="entity-link" >UserController</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppGateway.html" data-type="entity-link" >AppGateway</a>
                            </li>
                            <li class="link">
                                <a href="classes/Card.html" data-type="entity-link" >Card</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateRoomAndUserDto.html" data-type="entity-link" >CreateRoomAndUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/JoinUserRoom.html" data-type="entity-link" >JoinUserRoom</a>
                            </li>
                            <li class="link">
                                <a href="classes/Room.html" data-type="entity-link" >Room</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link" >User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserAuthDto.html" data-type="entity-link" >UserAuthDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CardService.html" data-type="entity-link" >CardService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtStrategy.html" data-type="entity-link" >JwtStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PrismaService.html" data-type="entity-link" >PrismaService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoomService.html" data-type="entity-link" >RoomService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RoomUserService.html" data-type="entity-link" >RoomUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserService.html" data-type="entity-link" >UserService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});