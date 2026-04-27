export type Category = 'K-POP' | '드라마' | '뉴스' | '문화' | '스포츠' | '음식';

export interface CandidateArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  selected: boolean;
}

export interface Content {
  id: string;
  title: string;
  titleEs: string;
  category: Category;
  summary: string;
  summaryEs: string;
  body: string;
  bodyEs: string;
  culturalNote: string;
  culturalNoteEs: string;
  sources: { title: string; url: string }[];
  publishedAt: string;
  likes: number;
  status: 'draft' | 'published';
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  likedContentIds: string[];
}

export const MOCK_CANDIDATE_ARTICLES: CandidateArticle[] = [
  {
    id: 'ca1',
    title: 'BTS 뷔, 솔로 앨범 발매 예정 발표',
    source: 'Naver 뉴스',
    url: 'https://news.naver.com/1',
    publishedAt: '2026-04-22',
    summary: 'BTS 멤버 뷔가 두 번째 솔로 앨범을 5월 중 발매할 예정이라고 소속사가 밝혔다.',
    selected: false,
  },
  {
    id: 'ca2',
    title: 'BLACKPINK 리사, 월드투어 일정 공개',
    source: 'Melon 뉴스',
    url: 'https://news.melon.com/1',
    publishedAt: '2026-04-22',
    summary: 'BLACKPINK 리사가 첫 솔로 월드투어 일정을 공개했다. 멕시코, 아르헨티나, 브라질 포함.',
    selected: false,
  },
  {
    id: 'ca3',
    title: "넷플릭스 신작 한국 드라마 '무빙2' 확정",
    source: '한국경제',
    url: 'https://hankyung.com/1',
    publishedAt: '2026-04-21',
    summary: "넷플릭스가 한국 슈퍼히어로 드라마 '무빙' 시즌2를 정식 발표했다.",
    selected: false,
  },
  {
    id: 'ca4',
    title: '손흥민, 시즌 20호골 달성',
    source: '스포츠조선',
    url: 'https://sportschosun.com/1',
    publishedAt: '2026-04-21',
    summary: '토트넘의 손흥민이 프리미어리그에서 시즌 20호골을 기록했다.',
    selected: false,
  },
  {
    id: 'ca5',
    title: '2026 한국 관광 트렌드: 로컬 감성 여행',
    source: '한국관광공사',
    url: 'https://visitkorea.or.kr/1',
    publishedAt: '2026-04-20',
    summary: "한국관광공사가 2026년 외국인 관광 트렌드로 '로컬 감성 여행'을 꼽았다.",
    selected: false,
  },
  {
    id: 'ca6',
    title: '봉준호 감독, 신작 크랭크인',
    source: '씨네21',
    url: 'https://cine21.com/1',
    publishedAt: '2026-04-19',
    summary: '봉준호 감독의 새로운 SF 스릴러 영화가 본격적인 촬영에 돌입했다.',
    selected: false,
  },
  {
    id: 'ca7',
    title: '한국 K-푸드, 글로벌 수출액 사상 최대치',
    source: '조선일보',
    url: 'https://chosun.com/1',
    publishedAt: '2026-04-18',
    summary: '올해 1분기 한국 농식품 수출액이 K-콘텐츠 인기에 힘입어 역대 최대를 기록했다.',
    selected: false,
  },
  {
    id: 'ca8',
    title: '서울 패션위크 2026, 화려한 개막',
    source: 'VOGUE Korea',
    url: 'https://vogue.co.kr/1',
    publishedAt: '2026-04-17',
    summary: "아시아 최대 규모의 패션 행사인 '서울 패션위크 2026'이 DDP에서 화려하게 개막했다.",
    selected: false,
  },
  {
    id: 'ca9',
    title: 'K-웹툰 글로벌 시장 수익 1조원 돌파',
    source: '조선일보',
    url: 'https://chosun.com/2',
    publishedAt: '2026-04-16',
    summary: '네이버와 카카오를 필두로 한 K-웹툰이 글로벌 시장에서 폭발적인 성장세를 기록했다.',
    selected: false,
  },
  {
    id: 'ca10',
    title: '뉴진스, 빌보드 핫100 3주 연속 진입',
    source: '디스패치',
    url: 'https://dispatch.co.kr/1',
    publishedAt: '2026-04-15',
    summary: '걸그룹 뉴진스의 신곡이 빌보드 메인 차트에 3주 연속 진입하며 글로벌 인기를 입증했다.',
    selected: false,
  },
  {
    id: 'ca11',
    title: '한강 작가, 새로운 소설로 프랑스 문학상 수상',
    source: '문학동네',
    url: 'https://munhak.com/1',
    publishedAt: '2026-04-14',
    summary: '한국 문학의 거장 한강 작가의 신작이 프랑스의 권위 있는 문학상을 거머쥐었다.',
    selected: false,
  },
  {
    id: 'ca12',
    title: 'T1, 리그 오브 레전드 월드 챔피언십 극적 우승',
    source: '인벤',
    url: 'https://inven.co.kr/1',
    publishedAt: '2026-04-13',
    summary: '페이커가 이끄는 T1이 다시 한번 롤드컵 우승 트로피를 들어올렸다.',
    selected: false,
  },
  {
    id: 'ca13',
    title: '한국의 매운맛 챌린지, 틱톡을 점령하다',
    source: '한국일보',
    url: 'https://hankookilbo.com/1',
    publishedAt: '2026-04-12',
    summary: '불닭볶음면을 시작으로 한 매운맛 챌린지가 전 세계 MZ세대 사이에서 유행하고 있다.',
    selected: false,
  },
  {
    id: 'ca14',
    title: 'K-뷰티, 미국 시장 점유율 1위 달성',
    source: '뷰티뉴스',
    url: 'https://beautynews.kr/1',
    publishedAt: '2026-04-11',
    summary: '합리적인 가격과 높은 품질을 앞세운 한국 화장품이 북미 시장을 장악하고 있다.',
    selected: false,
  },
  {
    id: 'ca15',
    title: "넷플릭스 '오징어 게임 시즌3' 제작 비하인드 공개",
    source: '씨네21',
    url: 'https://cine21.com/2',
    publishedAt: '2026-04-10',
    summary: '전 세계를 강타한 오징어 게임의 세 번째 시즌 촬영 현장이 최초로 공개되었다.',
    selected: false,
  },
  {
    id: 'ca16',
    title: '아이유, 상암 월드컵경기장 콘서트 전석 매진',
    source: 'Melon 뉴스',
    url: 'https://news.melon.com/2',
    publishedAt: '2026-04-09',
    summary: '아이유의 월드투어 서울 피날레 공연이 예매 오픈 5분 만에 전석 매진되었다.',
    selected: false,
  },
  {
    id: 'ca17',
    title: '외국인 유학생 30만 명 시대 열린다',
    source: '연합뉴스',
    url: 'https://yna.co.kr/1',
    publishedAt: '2026-04-08',
    summary: '한국 문화를 동경하여 한국으로 유학을 오는 외국인 학생 수가 역대 최다를 기록했다.',
    selected: false,
  },
  {
    id: 'ca18',
    title: '전통 한복의 현대화, 파리 패션위크에서 찬사',
    source: 'VOGUE Korea',
    url: 'https://vogue.co.kr/2',
    publishedAt: '2026-04-07',
    summary: '한국의 신진 디자이너들이 한복을 재해석한 컬렉션으로 파리 패션위크 무대를 빛냈다.',
    selected: false,
  },
];

export const MOCK_CONTENTS: Content[] = [
  {
    id: 'c1',
    title: 'BTS 뷔 솔로 컴백 예고: 알아야 할 모든 것',
    titleEs: 'El regreso en solitario de V de BTS: todo lo que necesitas saber',
    category: 'K-POP',
    summary: 'BTS 뷔가 2026년 5월 두 번째 솔로 앨범으로 돌아옵니다.',
    summaryEs: 'V de BTS regresa en mayo de 2026 con su segundo álbum en solitario.',
    body: `BTS의 멤버 뷔(김태형)가 두 번째 솔로 앨범으로 5월 컴백을 예고했습니다.

소속사 빅히트 뮤직은 공식 SNS를 통해 뷔의 새 앨범 발매 일정을 공개했으며, 이번 앨범은 그의 첫 솔로 앨범 'Layover'에 이은 두 번째 작품입니다.

팬들 사이에서는 이미 새 앨범에 대한 기대가 높아지고 있으며, 특히 중남미 팬덤 'ARMY'의 반응이 뜨겁습니다.`,
    bodyEs: `V (Kim Taehyung), miembro de BTS, ha anunciado su regreso con su segundo álbum en solitario en mayo.

Big Hit Music reveló el calendario del nuevo álbum de V a través de sus redes sociales oficiales. Este álbum será el sucesor de su primer trabajo en solitario, 'Layover'.

La expectativa entre los fans ya es alta, especialmente entre el ARMY latinoamericano.`,
    culturalNote:
      '빅히트 뮤직은 BTS가 소속된 하이브(HYBE)의 레이블입니다. 한국 아이돌 산업에서 소속사는 아티스트의 모든 활동을 직접 관리합니다.',
    culturalNoteEs:
      'Big Hit Music es el sello de HYBE, la empresa a la que pertenece BTS. En la industria del idol coreano, la agencia gestiona directamente todas las actividades del artista.',
    sources: [{ title: 'Naver 뉴스 - BTS 뷔 솔로 컴백', url: 'https://news.naver.com/1' }],
    publishedAt: '2026-04-22',
    likes: 142,
    status: 'published',
    comments: [
      {
        id: 'cm1',
        userId: 'u2',
        userName: 'Maria G.',
        body: '¡Estoy tan emocionada! 😭',
        createdAt: '2026-04-22',
      },
      {
        id: 'cm2',
        userId: 'u3',
        userName: 'Carlos R.',
        body: 'Layover fue increíble, espero que este álbum sea igual.',
        createdAt: '2026-04-22',
      },
    ],
  },
  {
    id: 'c2',
    title: '리사 월드투어, 중남미 팬들의 꿈이 현실로',
    titleEs: 'La gira mundial de LISA llega a Latinoamérica',
    category: 'K-POP',
    summary:
      'BLACKPINK 리사가 멕시코, 아르헨티나, 브라질을 포함한 첫 솔로 월드투어를 확정했습니다.',
    summaryEs:
      'LISA de BLACKPINK confirma su primera gira mundial en solitario, incluyendo México, Argentina y Brasil.',
    body: `BLACKPINK의 리사(라리사 마노반)가 첫 솔로 월드투어 일정을 전격 공개했습니다.

이번 투어에는 멕시코시티, 부에노스아이레스, 상파울루가 포함되어 있어 중남미 팬들의 환호를 받고 있습니다.`,
    bodyEs: `LISA (Lalisa Manoban) de BLACKPINK anunció su primera gira mundial en solitario.

La gira incluye Ciudad de México, Buenos Aires y São Paulo, lo que ha generado gran emoción entre los fans latinoamericanos.`,
    culturalNote:
      'BLACKPINK는 YG엔터테인먼트 소속의 4인조 걸그룹으로, 전 세계에서 가장 많은 팔로워를 보유한 걸그룹입니다.',
    culturalNoteEs:
      'BLACKPINK es un grupo de chicas de 4 miembros de YG Entertainment, el grupo femenino con más seguidores del mundo.',
    sources: [{ title: 'Melon 뉴스 - 리사 월드투어', url: 'https://news.melon.com/1' }],
    publishedAt: '2026-04-22',
    likes: 89,
    status: 'published',
    comments: [],
  },
  {
    id: 'c3',
    title: '무빙 시즌2: 한국 슈퍼히어로의 귀환',
    titleEs: 'Moving Temporada 2: El regreso de los superhéroes coreanos',
    category: '드라마',
    summary: "넷플릭스 오리지널 '무빙' 시즌2가 공식 확정되었습니다.",
    summaryEs: "Se confirma oficialmente la temporada 2 de la serie original de Netflix 'Moving'.",
    body: `넷플릭스가 한국 슈퍼히어로 드라마 '무빙' 시즌2를 공식 발표했습니다.

시즌1은 공개 직후 넷플릭스 글로벌 차트 상위권에 오르며 큰 인기를 끌었습니다.`,
    bodyEs: `Netflix ha anunciado oficialmente la segunda temporada del drama coreano de superhéroes 'Moving'.

La primera temporada se convirtió en un éxito global inmediatamente después de su lanzamiento.`,
    culturalNote:
      "'무빙'은 강풀 작가의 동명 웹툰을 원작으로 한 드라마입니다. 한국에서는 웹툰을 원작으로 한 드라마 제작이 매우 활발합니다.",
    culturalNoteEs:
      "'Moving' está basada en el webtoon homónimo del autor Kang Full. En Corea, la adaptación de webtoons a dramas es muy común.",
    sources: [{ title: '한국경제 - 무빙2 확정', url: 'https://hankyung.com/1' }],
    publishedAt: '2026-04-21',
    likes: 67,
    status: 'published',
    comments: [],
  },
  {
    id: 'c4',
    title: '손흥민 20골: 프리미어리그의 한국 영웅',
    titleEs: 'Son Heung-min 20 goles: el héroe coreano de la Premier League',
    category: '스포츠',
    summary: '손흥민이 시즌 20호골을 기록하며 아시아 선수 역대 최다 골 기록에 도전하고 있습니다.',
    summaryEs:
      'Son Heung-min marca 20 goles esta temporada y desafía el récord histórico de goles para un jugador asiático.',
    body: `토트넘의 손흥민이 프리미어리그에서 시즌 20호골을 달성했습니다.

이 기록으로 손흥민은 아시아 선수 최초로 프리미어리그 2번의 20골 달성이라는 역사를 썼습니다.`,
    bodyEs: `Son Heung-min del Tottenham ha marcado su gol número 20 en la Premier League esta temporada.

Con este récord, Son se convierte en el primer jugador asiático en marcar 20 goles en dos temporadas de la Premier League.`,
    culturalNote:
      '손흥민은 한국에서 국민 영웅으로 불리며, 그의 경기는 한국 시간 새벽에도 많은 팬들이 생중계로 시청합니다.',
    culturalNoteEs:
      'Son Heung-min es considerado un héroe nacional en Corea, y sus partidos son vistos en directo por millones de fans coreanos incluso de madrugada.',
    sources: [{ title: '스포츠조선 - 손흥민 20골', url: 'https://sportschosun.com/1' }],
    publishedAt: '2026-04-21',
    likes: 55,
    status: 'published',
    comments: [],
  },
  {
    id: 'c5',
    title: '2026 한국 여행 트렌드: 로컬 감성이 뜬다',
    titleEs: 'Tendencias de viaje a Corea en 2026: el turismo local está de moda',
    category: '문화',
    summary: "한국 관광공사가 발표한 2026년 트렌드는 '로컬 감성 여행'입니다.",
    summaryEs:
      "La Organización de Turismo de Corea destaca el 'turismo de experiencia local' como tendencia de 2026.",
    body: `한국관광공사가 2026년 외국인 관광 트렌드로 '로컬 감성 여행'을 선정했습니다.

서울 중심의 관광에서 벗어나 전주, 경주, 통영 등 지역 도시로 발길을 돌리는 외국인 여행자가 급증하고 있습니다.`,
    bodyEs: `La Organización de Turismo de Corea ha seleccionado el 'turismo de experiencia local' como tendencia para turistas extranjeros en 2026.

Cada vez más viajeros extranjeros se alejan del turismo centrado en Seúl y visitan ciudades regionales como Jeonju, Gyeongju y Tongyeong.`,
    culturalNote:
      '전주는 한국 전통 한옥마을로 유명하며, 경주는 신라 왕조의 수도였던 역사 도시입니다.',
    culturalNoteEs:
      'Jeonju es famosa por su aldea tradicional de casas Hanok, mientras que Gyeongju fue la capital de la dinastía Silla.',
    sources: [{ title: '한국관광공사 - 2026 관광 트렌드', url: 'https://visitkorea.or.kr/1' }],
    publishedAt: '2026-04-20',
    likes: 43,
    status: 'published',
    comments: [],
  },
  {
    id: 'c6',
    title: '뉴진스, 빌보드 핫 100 3주 연속 진입',
    titleEs: 'NewJeans entra en el Billboard Hot 100 durante 3 semanas consecutivas',
    category: 'K-POP',
    summary: '뉴진스의 신곡이 빌보드 메인 차트에 3주 연속 진입하며 글로벌 인기를 입증했습니다.',
    summaryEs:
      'El nuevo single de NewJeans permanece en el Hot 100 por tercera semana consecutiva, consolidando su fama global.',
    body: `걸그룹 뉴진스(NewJeans)의 신곡이 빌보드 핫 100 차트에 3주 연속 진입하는 기염을 토했습니다.

이번 기록은 한국 걸그룹 역사상 빌보드 핫 100에 가장 오랜 기간 머문 기록으로, 소속사 어도어(ADOR)는 공식 SNS를 통해 기쁨을 전했습니다.

뉴진스는 특유의 Y2K 감성과 중독성 있는 훅으로 글로벌 10대 팬덤을 사로잡으며 K-POP의 새로운 장을 열고 있다는 평가를 받고 있습니다.`,
    bodyEs: `El nuevo sencillo del grupo femenino NewJeans ha logrado aparecer en el Billboard Hot 100 por tercera semana consecutiva.

Este récord es el más largo en la historia de los grupos femeninos coreanos en el Hot 100, y su discográfica ADOR expresó su alegría a través de las redes sociales oficiales.

NewJeans está abriendo una nueva era del K-POP con su particular estética Y2K y sus pegadizos estribillos, cautivando a los fans adolescentes de todo el mundo.`,
    culturalNote:
      '어도어(ADOR)는 하이브(HYBE) 산하 레이블로, 뉴진스의 독특한 비주얼과 음악 방향성을 이끌고 있습니다. Y2K 감성은 2000년대 초반 문화에서 영감을 받은 스타일을 의미합니다.',
    culturalNoteEs:
      'ADOR es un sello subsidiario de HYBE que lidera la dirección musical y visual única de NewJeans. La estética Y2K hace referencia a un estilo inspirado en la cultura de principios de los 2000.',
    sources: [{ title: '디스패치 - 뉴진스 빌보드', url: 'https://dispatch.co.kr/1' }],
    publishedAt: '2026-04-15',
    likes: 198,
    status: 'published',
    comments: [
      {
        id: 'cm6',
        userId: 'u4',
        userName: 'Sofía L.',
        body: 'NewJeans es increíble, me encanta su estilo!',
        createdAt: '2026-04-15',
      },
    ],
  },
  {
    id: 'c7',
    title: '세븐틴, 월드투어 아레나 공연 전석 매진',
    titleEs: 'SEVENTEEN agota entradas en todos sus conciertos en arena de la gira mundial',
    category: 'K-POP',
    summary: '13인조 그룹 세븐틴이 북미·유럽 아레나 투어 전 회차 티켓을 매진시켰습니다.',
    summaryEs:
      'El grupo de 13 integrantes SEVENTEEN ha agotado todas las entradas de su gira en arenas de Norteamérica y Europa.',
    body: `세븐틴(SEVENTEEN)이 진행 중인 월드투어 'FOLLOW TO SEOUL'이 북미와 유럽 전 공연장에서 매진을 기록했습니다.

뉴욕 메디슨 스퀘어 가든, 런던 O2 아레나 등 세계적인 대형 공연장에서 진행된 이번 투어는 K-POP 그룹의 아레나 투어 중 역대 최대 규모로 기록되었습니다.

세븐틴은 대부분의 안무와 프로덕션을 자체 제작하는 '자체 제작 아이돌'로 알려져 있으며, 이번 투어에서도 그 역량이 돋보였다는 평가입니다.`,
    bodyEs: `La gira mundial 'FOLLOW TO SEOUL' de SEVENTEEN ha agotado todas las entradas en los recintos de Norteamérica y Europa.

La gira, que incluye venues emblemáticos como el Madison Square Garden de Nueva York y el O2 Arena de Londres, se ha convertido en la gira de arena de mayor escala en la historia del K-POP.

SEVENTEEN es conocido como un grupo de 'autoproduccores', que desarrollan la mayor parte de su coreografía y producción internamente, una capacidad que también brilló en esta gira.`,
    culturalNote:
      '세븐틴은 13명의 멤버가 보컬, 힙합, 퍼포먼스 세 유닛으로 나뉘어 활동합니다. 한국 아이돌 그룹은 대규모 멤버 구성과 정교한 그룹 안무로 유명합니다.',
    culturalNoteEs:
      'Los 13 miembros de SEVENTEEN se dividen en tres unidades: vocal, hip-hop y performance. Los grupos de idols coreanos son conocidos por sus numerosos integrantes y su intrincada coreografía grupal.',
    sources: [{ title: 'Melon 뉴스 - 세븐틴 투어', url: 'https://news.melon.com/3' }],
    publishedAt: '2026-04-14',
    likes: 134,
    status: 'published',
    comments: [],
  },
  {
    id: 'c8',
    title: 'aespa, SF 콘셉트 신보로 컴백 예고',
    titleEs: 'aespa anuncia su regreso con un nuevo álbum de concepto de ciencia ficción',
    category: 'K-POP',
    summary: 'SM엔터테인먼트 소속 aespa가 메타버스 세계관을 확장한 신보로 5월 컴백을 알렸습니다.',
    summaryEs:
      'aespa de SM Entertainment anuncia su regreso en mayo con un nuevo álbum que expande su universo del metaverso.',
    body: `SM엔터테인먼트 소속 걸그룹 aespa가 5월 중 신보를 발매한다고 발표했습니다.

이번 앨범은 aespa의 독특한 '스마' 세계관을 한층 더 확장한 작품으로, 멤버들의 디지털 아바타인 'ae'와 현실 세계의 이야기가 교차되는 SF 콘셉트를 담았습니다.

티저 이미지에서 공개된 미래지향적 비주얼은 이미 전 세계 팬들 사이에서 큰 화제를 낳고 있습니다.`,
    bodyEs: `El grupo femenino aespa de SM Entertainment ha anunciado el lanzamiento de un nuevo álbum en mayo.

Este álbum amplía aún más el universo 'SMCU' característico de aespa, con un concepto de ciencia ficción donde se entrelazan las historias de los avatares digitales 'ae' de las integrantes y el mundo real.

Las imágenes teaser de visuales futuristas ya están siendo un gran tema de conversación entre los fans de todo el mundo.`,
    culturalNote:
      "aespa의 세계관은 '스마(SMCU)'라 불리며, 현실과 가상 세계를 넘나드는 독특한 스토리텔링 방식입니다. SM엔터테인먼트는 이러한 IP(지식재산권) 기반 스토리텔링의 선구자입니다.",
    culturalNoteEs:
      "El universo de aespa se llama 'SMCU' y es una forma única de contar historias que cruza el mundo real y el virtual. SM Entertainment es pionero en este tipo de storytelling basado en propiedad intelectual (IP).",
    sources: [{ title: 'SM엔터테인먼트 공식 발표', url: 'https://smtown.com/1' }],
    publishedAt: '2026-04-13',
    likes: 112,
    status: 'published',
    comments: [],
  },
  {
    id: 'c9',
    title: '스트레이 키즈, AMA 4관왕 달성',
    titleEs: 'Stray Kids logra 4 premios en los American Music Awards',
    category: 'K-POP',
    summary:
      '스트레이 키즈가 아메리칸 뮤직 어워드에서 4개 부문을 석권하며 K-POP의 위상을 높였습니다.',
    summaryEs:
      'Stray Kids arrasa en los American Music Awards con 4 categorías, elevando el prestigio del K-POP.',
    body: `JYP엔터테인먼트 소속 보이그룹 스트레이 키즈(Stray Kids)가 미국 아메리칸 뮤직 어워드(AMA)에서 4개 부문을 수상하는 쾌거를 이뤘습니다.

이번 수상으로 스트레이 키즈는 K-POP 그룹 중 AMA에서 단일 시상식 최다 수상 기록을 세웠습니다.

8인조로 구성된 이 그룹은 자작곡과 자체 프로듀싱으로 유명하며, 이를 3RACHA라는 내부 프로듀서 유닛이 담당하고 있습니다.`,
    bodyEs: `El grupo masculino Stray Kids de JYP Entertainment logró una hazaña al ganar 4 categorías en los American Music Awards (AMA) de Estados Unidos.

Con este triunfo, Stray Kids estableció el récord de mayor número de premios ganados por un grupo de K-POP en una sola entrega de los AMA.

El grupo de 8 integrantes es conocido por sus canciones y producción propias, manejadas por una unidad productora interna llamada 3RACHA.`,
    culturalNote:
      '스트레이 키즈 내 프로듀서 유닛 3RACHA는 방찬, 창빈, 한으로 구성됩니다. 한국 아이돌이 직접 음악을 제작하는 경향은 팬들에게 더 깊은 아티스트 정체성을 부여합니다.',
    culturalNoteEs:
      'La unidad productora 3RACHA dentro de Stray Kids está formada por Bang Chan, Changbin y Han. La tendencia de los idols coreanos a producir su propia música les otorga una identidad artística más profunda ante los fans.',
    sources: [{ title: '스포츠동아 - AMA 수상', url: 'https://donga.com/1' }],
    publishedAt: '2026-04-12',
    likes: 97,
    status: 'published',
    comments: [],
  },
  {
    id: 'c10',
    title: 'IVE, 글로벌 스트리밍 10억 뷰 돌파',
    titleEs: 'IVE supera los 1.000 millones de reproducciones globales en streaming',
    category: 'K-POP',
    summary:
      '스타쉽엔터테인먼트 걸그룹 IVE가 데뷔 3년 만에 글로벌 누적 10억 스트리밍을 달성했습니다.',
    summaryEs:
      'IVE de Starship Entertainment alcanza los 1.000 millones de reproducciones acumuladas en todo el mundo, tan solo 3 años después de su debut.',
    body: `스타쉽엔터테인먼트 소속 6인조 걸그룹 IVE가 데뷔 3주년을 맞아 글로벌 누적 스트리밍 10억 뷰를 달성했습니다.

'AFTER LIKE', 'LOVE DIVE' 등 연속 히트곡을 배출하며 '국민 걸그룹'의 위상을 굳힌 IVE는 이번 기록으로 K-POP 4세대 걸그룹 중 가장 빠른 10억 달성을 기록했습니다.

멤버 안유진과 장원영은 예능과 광고 분야에서도 두각을 나타내며 다방면에서 활약 중입니다.`,
    bodyEs: `El grupo femenino de 6 integrantes IVE de Starship Entertainment alcanzó 1.000 millones de reproducciones globales acumuladas al cumplir su tercer aniversario desde el debut.

Consolidada como el 'grupo femenino nacional' con éxitos consecutivos como 'AFTER LIKE' y 'LOVE DIVE', IVE logró el hito del billón de reproducciones a la mayor velocidad entre los grupos femeninos de la 4ª generación del K-POP.

Las integrantes Ahn Yujin y Jang Wonyoung también destacan en el mundo de los programas de variedades y la publicidad.`,
    culturalNote:
      "'4세대 K-POP'은 대략 2019년 이후 데뷔한 그룹들을 지칭합니다. BTS와 BLACKPINK가 3세대를 대표한다면, IVE, NewJeans, aespa 등이 4세대를 이끌고 있습니다.",
    culturalNoteEs:
      "El 'K-POP de 4ª generación' se refiere aproximadamente a los grupos debutados después de 2019. Si BTS y BLACKPINK representan la 3ª generación, IVE, NewJeans y aespa lideran la 4ª generación.",
    sources: [{ title: '스타쉽엔터테인먼트 공식 발표', url: 'https://starshipent.com/1' }],
    publishedAt: '2026-04-11',
    likes: 81,
    status: 'published',
    comments: [],
  },
  {
    id: 'c11',
    title: '더 글로리 시즌3 제작 공식 확정',
    titleEs: 'Se confirma oficialmente la producción de La Gloria temporada 3',
    category: '드라마',
    summary: "넷플릭스가 학교폭력 복수극 '더 글로리'의 세 번째 시즌 제작을 공식 발표했습니다.",
    summaryEs:
      "Netflix anuncia oficialmente la producción de la tercera temporada de 'La Gloria', el drama de venganza sobre el acoso escolar.",
    body: `넷플릭스 오리지널 시리즈 '더 글로리'의 시즌3 제작이 공식 확정되었습니다.

시즌1, 2를 통해 전 세계적인 성공을 거둔 '더 글로리'는 학교폭력 피해자의 정교한 복수를 다룬 작품으로, 시즌 종료 후에도 지속적인 팬들의 요청에 힘입어 시즌3 제작으로 이어지게 되었습니다.

김은숙 작가와 안길호 감독이 다시 한번 합을 맞추며, 문동은(송혜교)의 이야기가 새로운 챕터로 이어질 전망입니다.`,
    bodyEs: `Se ha confirmado oficialmente la producción de la tercera temporada de la serie original de Netflix 'La Gloria'.

'La Gloria', que logró un éxito mundial a través de sus temporadas 1 y 2 al retratar la meticulosa venganza de una víctima de acoso escolar, avanzará hacia una temporada 3 impulsada por las continuas peticiones de los fans después del final.

La guionista Kim Eun-sook y el director Ahn Gil-ho vuelven a unir fuerzas, con la historia de Moon Dong-eun (Song Hye-kyo) continuando en un nuevo capítulo.`,
    culturalNote:
      "김은숙은 '도깨비', '태양의 후예' 등 여러 히트작을 집필한 한국 최고의 드라마 작가 중 한 명입니다. '더 글로리'는 한국 사회의 학교폭력 문제에 대한 사회적 경각심도 높였습니다.",
    culturalNoteEs:
      "Kim Eun-sook es una de las mejores guionistas de dramas de Corea, autora de varios éxitos como 'Goblin' y 'Descendants of the Sun'. 'La Gloria' también aumentó la conciencia social sobre el problema del acoso escolar en Corea.",
    sources: [{ title: '넷플릭스 코리아 공식 발표', url: 'https://netflix.com/kr/1' }],
    publishedAt: '2026-04-10',
    likes: 156,
    status: 'published',
    comments: [
      {
        id: 'cm11',
        userId: 'u5',
        userName: 'Ana P.',
        body: '¡No puedo esperar! La Gloria es una obra maestra.',
        createdAt: '2026-04-10',
      },
    ],
  },
  {
    id: 'c12',
    title: '오징어 게임 시즌3 예고편 공개',
    titleEs: 'Se revela el tráiler de El juego del calamar temporada 3',
    category: '드라마',
    summary: '넷플릭스가 오징어 게임 시즌3의 공식 예고편을 공개하며 전 세계 팬들을 열광시켰습니다.',
    summaryEs:
      'Netflix lanza el tráiler oficial de El juego del calamar temporada 3, emocionando a fans de todo el mundo.',
    body: `넷플릭스가 전 세계를 강타한 한국 드라마 '오징어 게임' 시즌3의 공식 예고편을 공개했습니다.

90초 분량의 티저 영상은 공개 24시간 만에 유튜브 조회수 5,000만을 돌파하며 화제를 모았습니다.

황동혁 감독은 시즌3가 시리즈의 완결편이 될 것이라고 밝히며, 성기훈(이정재)의 최후 선택이 드라마의 핵심이 될 것이라고 예고했습니다.`,
    bodyEs: `Netflix ha revelado el tráiler oficial de la temporada 3 del drama coreano 'El juego del calamar', que sacudió al mundo entero.

El video teaser de 90 segundos superó los 50 millones de visualizaciones en YouTube en las primeras 24 horas tras su lanzamiento.

El director Hwang Dong-hyuk reveló que la temporada 3 será el final de la serie, adelantando que la elección final de Seong Gi-hun (Lee Jung-jae) será el núcleo del drama.`,
    culturalNote:
      "오징어 게임은 한국의 전통 놀이를 소재로 하여 전 세계적인 큰 반향을 일으켰습니다. '무궁화 꽃이 피었습니다'와 같은 한국 놀이가 전 세계에 알려지는 계기가 되었습니다.",
    culturalNoteEs:
      "El juego del calamar utilizó juegos tradicionales coreanos como temática y causó una gran repercusión en todo el mundo. Juegos coreanos como 'Hibisco rojo, hibisco blanco' ('Un, dos, tres, pollito inglés' en versión coreana) se dieron a conocer globalmente.",
    sources: [{ title: '씨네21 - 오징어 게임 S3', url: 'https://cine21.com/3' }],
    publishedAt: '2026-04-09',
    likes: 231,
    status: 'published',
    comments: [
      {
        id: 'cm12',
        userId: 'u6',
        userName: 'Juan M.',
        body: '¡El tráiler está increíble! Ya quiero verlo.',
        createdAt: '2026-04-09',
      },
    ],
  },
  {
    id: 'c13',
    title: '이상한 변호사 우영우 미국 리메이크 확정',
    titleEs: "Se confirma el remake estadounidense de 'Abogada extraordinaria Woo'",
    category: '드라마',
    summary:
      "ENA 드라마 '이상한 변호사 우영우'가 미국 ABC 방송국의 공식 리메이크 작품으로 제작됩니다.",
    summaryEs:
      "El drama ENA 'Abogada extraordinaria Woo' será producido como remake oficial de la cadena estadounidense ABC.",
    body: `한국 드라마 '이상한 변호사 우영우'가 미국 ABC 방송국의 공식 리메이크 작품으로 제작된다는 소식이 전해졌습니다.

자폐 스펙트럼 장애를 가진 천재 변호사의 이야기를 담은 이 드라마는 2022년 방영 당시 넷플릭스 글로벌 1위를 차지하며 전 세계적인 인기를 끌었습니다.

미국 리메이크판은 ABC 정규 시즌으로 방영될 예정이며, 오리지널 스토리를 미국 사회·문화 맥락에 맞게 각색할 것으로 알려졌습니다.`,
    bodyEs: `Se informó que el drama coreano 'Abogada extraordinaria Woo' será producido como remake oficial de la cadena estadounidense ABC.

Este drama, que narra la historia de una abogada de genio con trastorno del espectro autista, alcanzó el número 1 mundial en Netflix durante su emisión en 2022 y cosechó una popularidad global.

El remake estadounidense se emitirá como temporada regular de ABC y, según se informa, adaptará la historia original al contexto social y cultural de Estados Unidos.`,
    culturalNote:
      "'이상한 변호사 우영우'는 자폐 스펙트럼 장애에 대한 인식을 높이는 데 기여했습니다. 한국 드라마가 할리우드 리메이크로 이어지는 것은 K-컨텐츠의 글로벌 위상을 보여줍니다.",
    culturalNoteEs:
      "'Abogada extraordinaria Woo' contribuyó a aumentar la concienciación sobre el trastorno del espectro autista. Que un drama coreano derive en un remake de Hollywood demuestra el estatus global del contenido K.",
    sources: [{ title: '한국경제 - 우영우 리메이크', url: 'https://hankyung.com/2' }],
    publishedAt: '2026-04-08',
    likes: 119,
    status: 'published',
    comments: [],
  },
  {
    id: 'c14',
    title: '지옥 시즌2, 넷플릭스 공개 첫 주 글로벌 1위',
    titleEs: "'Infierno' temporada 2 alcanza el número 1 global en Netflix en su primera semana",
    category: '드라마',
    summary:
      "연상호 감독의 '지옥' 시즌2가 넷플릭스에서 공개 첫 주 글로벌 비영어권 드라마 1위를 기록했습니다.",
    summaryEs:
      "La temporada 2 de 'Infierno' del director Yeon Sang-ho ocupa el primer lugar mundial en dramas no ingleses en Netflix en su primera semana.",
    body: `연상호 감독의 넷플릭스 오리지널 '지옥' 시즌2가 공개 첫 주 글로벌 비영어권 드라마 1위를 차지했습니다.

2021년 시즌1 공개 당시에도 전 세계를 충격에 빠트렸던 '지옥'은, 시즌2에서 새로운 종교 집단과 초자연적 현상이 심화되는 스토리를 선보였습니다.

연상호 감독은 "'지옥'이 단순한 공포물이 아닌 현대 사회의 집단 심리와 종교적 광기를 다룬 작품"이라고 밝혔습니다.`,
    bodyEs: `'Infierno' temporada 2 del director Yeon Sang-ho ocupó el primer puesto mundial en dramas no ingleses en Netflix durante su primera semana de emisión.

'Infierno', que ya conmocionó al mundo cuando se estrenó la temporada 1 en 2021, presentó en la temporada 2 una historia que profundiza en un nuevo grupo religioso y fenómenos sobrenaturales.

El director Yeon Sang-ho declaró que "'Infierno' no es simplemente un terror, sino una obra que aborda la psicología colectiva de la sociedad moderna y el fanatismo religioso".`,
    culturalNote:
      "연상호 감독은 '부산행'으로 세계적으로 이름을 알린 한국의 대표적인 장르 영화 감독입니다. '지옥'은 최규석의 동명 웹툰을 원작으로 합니다.",
    culturalNoteEs:
      "El director Yeon Sang-ho es un reconocido director de género coreano que se dio a conocer mundialmente con 'Train to Busan'. 'Infierno' está basado en el webtoon homónimo de Choi Kyu-seok.",
    sources: [{ title: '씨네21 - 지옥 시즌2', url: 'https://cine21.com/4' }],
    publishedAt: '2026-04-07',
    likes: 88,
    status: 'published',
    comments: [],
  },
  {
    id: 'c15',
    title: '서울, 세계 스마트시티 지수 3년 연속 1위',
    titleEs: 'Seúl lidera el Índice de Ciudades Inteligentes del Mundo por tercer año consecutivo',
    category: '뉴스',
    summary:
      'IMD 스마트시티 지수에서 서울이 3년 연속 1위를 기록하며 도시 혁신의 아이콘으로 자리잡았습니다.',
    summaryEs:
      'Seúl lidera por tercer año consecutivo el IMD Smart City Index, consolidándose como ícono de la innovación urbana.',
    body: `스위스 경영대학원 IMD가 발표한 '2026 스마트시티 지수'에서 서울이 3년 연속 세계 1위를 차지했습니다.

서울은 디지털 인프라, 교통, 의료, 행정 서비스 분야에서 모두 최고점을 받으며 도시 혁신의 선두주자임을 다시 한번 입증했습니다.

특히 서울의 '스마트서울맵', AI 기반 교통 관리 시스템, 24시간 민원 처리 챗봇 등이 심사위원들에게 높은 평가를 받았습니다.`,
    bodyEs: `Seúl obtuvo el primer puesto mundial por tercer año consecutivo en el 'Índice de Ciudades Inteligentes 2026' publicado por la escuela de negocios suiza IMD.

Seúl demostró una vez más ser líder en innovación urbana al obtener la puntuación máxima en infraestructura digital, transporte, atención médica y servicios administrativos.

En particular, el 'Mapa Inteligente de Seúl', el sistema de gestión del tráfico basado en IA y el chatbot de atención al ciudadano disponible las 24 horas recibieron altas valoraciones por parte del jurado.`,
    culturalNote:
      "한국은 1960~70년대 급격한 산업화를 거친 후 IT 강국으로 성장했습니다. '빨리빨리(ppalli-ppalli)' 문화는 한국의 빠른 기술 채택과 도시 혁신의 원동력 중 하나로 꼽힙니다.",
    culturalNoteEs:
      "Corea creció hasta convertirse en potencia informática tras una rápida industrialización en los años 60-70. La cultura 'ppalli-ppalli' (rápido-rápido) es considerada uno de los motores de la rápida adopción tecnológica e innovación urbana de Corea.",
    sources: [{ title: '연합뉴스 - 서울 스마트시티 1위', url: 'https://yna.co.kr/2' }],
    publishedAt: '2026-04-06',
    likes: 74,
    status: 'published',
    comments: [],
  },
  {
    id: 'c16',
    title: '한국 반도체 1분기 수출 사상 최대치 경신',
    titleEs:
      'Las exportaciones de semiconductores coreanos marcan un nuevo máximo histórico en el primer trimestre',
    category: '뉴스',
    summary: '삼성전자와 SK하이닉스 주도로 한국 반도체 수출이 1분기 역대 최고 기록을 갱신했습니다.',
    summaryEs:
      'Lideradas por Samsung Electronics y SK Hynix, las exportaciones de semiconductores de Corea baten un nuevo récord histórico en el primer trimestre.',
    body: `산업통상자원부에 따르면 2026년 1분기 한국 반도체 수출액이 역대 최고치를 기록했습니다.

AI 열풍에 따른 고대역폭 메모리(HBM) 수요 급증이 주요 원인으로, 삼성전자와 SK하이닉스 모두 분기 최대 매출을 달성했습니다.

전문가들은 AI 인프라 투자 증가와 데이터센터 확장 수요가 지속되는 한, 한국 반도체 산업의 호황이 당분간 이어질 것으로 전망합니다.`,
    bodyEs: `Según el Ministerio de Comercio, Industria y Energía, las exportaciones de semiconductores de Corea en el primer trimestre de 2026 registraron el mayor valor histórico.

El principal motivo es el rápido aumento de la demanda de memoria de alto ancho de banda (HBM) impulsado por el auge de la IA, y tanto Samsung Electronics como SK Hynix lograron sus máximas ventas trimestrales.

Los expertos prevén que el auge de la industria de semiconductores de Corea continuará por algún tiempo mientras persista el aumento de la inversión en infraestructura de IA y la demanda de expansión de centros de datos.`,
    culturalNote:
      '삼성전자는 세계 최대 메모리 반도체 기업이며, SK하이닉스는 HBM 분야에서 세계 선두주자입니다. 반도체는 한국 수출의 약 20%를 차지하는 핵심 산업입니다.',
    culturalNoteEs:
      'Samsung Electronics es el mayor fabricante mundial de semiconductores de memoria, y SK Hynix es el líder mundial en HBM. Los semiconductores representan aproximadamente el 20% de las exportaciones coreanas y son una industria clave.',
    sources: [{ title: '산업통상자원부 공식 발표', url: 'https://motie.go.kr/1' }],
    publishedAt: '2026-04-05',
    likes: 52,
    status: 'published',
    comments: [],
  },
  {
    id: 'c17',
    title: '해외 입양인들의 한국어 배우기 열풍',
    titleEs: 'La fiebre por aprender coreano entre los adoptados internacionales',
    category: '뉴스',
    summary:
      '전 세계 해외 입양인들이 K-콘텐츠를 통해 한국어와 뿌리 찾기에 나서는 사례가 급증하고 있습니다.',
    summaryEs:
      'Aumentan rápidamente los casos de adoptados internacionales que aprenden coreano y buscan sus raíces a través del contenido K.',
    body: `K-POP과 K-드라마의 인기가 높아지면서, 전 세계 해외 입양인들 사이에서 한국어를 배우고 자신의 뿌리를 찾으려는 움직임이 확산되고 있습니다.

특히 미국, 프랑스, 덴마크 등에서 성장한 한국계 입양인들은 K-콘텐츠를 통해 처음 한국어와 문화에 눈을 뜨고, 이후 한국을 방문하거나 장기 체류하는 경우도 늘고 있습니다.

정부는 해외 입양인의 뿌리 찾기를 지원하는 프로그램을 강화하고, 입양인 커뮤니티와의 교류를 확대하고 있습니다.`,
    bodyEs: `Con el creciente auge del K-POP y los K-dramas, se está extendiendo entre los adoptados internacionales de todo el mundo el movimiento de aprender coreano y buscar sus raíces.

En particular, los adoptados de origen coreano criados en países como Estados Unidos, Francia o Dinamarca descubren por primera vez el idioma y la cultura coreana a través del contenido K, y cada vez más visitan o se quedan largo tiempo en Corea.

El gobierno está reforzando los programas de apoyo a la búsqueda de raíces de los adoptados internacionales y ampliando el intercambio con las comunidades de adoptados.`,
    culturalNote:
      '한국은 1950~80년대 사이 해외 입양아 송출 국가 중 하나였습니다. 현재 약 20만 명의 한국계 해외 입양인이 전 세계에 거주하고 있으며, 이들의 정체성 탐색은 중요한 사회적 이슈입니다.',
    culturalNoteEs:
      'Corea fue uno de los principales países de adopción internacional entre los años 50 y 80. Actualmente, aproximadamente 200.000 adoptados de origen coreano residen en todo el mundo, y su búsqueda de identidad es un importante tema social.',
    sources: [{ title: '한겨레 - 해외 입양인 한국어 열풍', url: 'https://hani.co.kr/1' }],
    publishedAt: '2026-04-04',
    likes: 66,
    status: 'published',
    comments: [],
  },
  {
    id: 'c18',
    title: '한글, 유네스코 세계기록유산 재인증',
    titleEs: 'El hangul recibe la recertificación del Patrimonio Documental de la UNESCO',
    category: '문화',
    summary:
      "한국의 고유 문자 '한글'이 유네스코 세계기록유산으로 재인증되며 그 독창성과 우수성이 재조명되었습니다.",
    summaryEs:
      "El sistema de escritura propio de Corea, el 'hangul', recibe la recertificación del Patrimonio Documental de la UNESCO, destacándose de nuevo su originalidad y excelencia.",
    body: `유네스코가 한국의 고유 문자인 '한글'을 세계기록유산으로 재인증하며 한글의 독창성과 학술적 가치를 다시 한번 공인했습니다.

1443년 세종대왕이 창제한 한글은 세계에서 만든 사람과 만든 날짜, 만든 이유가 명확히 알려진 유일한 문자 체계로, 언어학자들 사이에서 가장 과학적인 문자 중 하나로 꼽힙니다.

매년 10월 9일 한국에서 기념하는 '한글날'은 이 독창적인 문자를 기리는 국경일로, 전 세계 한국어 학습자들도 함께 축하합니다.`,
    bodyEs: `La UNESCO recertificó el 'hangul', el sistema de escritura propio de Corea, como Patrimonio Documental del Mundo, reconociendo una vez más su originalidad y valor académico.

El hangul, creado en 1443 por el rey Sejong el Grande, es el único sistema de escritura en el mundo del que se conoce claramente su creador, la fecha de creación y el motivo, y es considerado uno de los sistemas de escritura más científicos entre los lingüistas.

El 'Día del Hangul', que se celebra en Corea el 9 de octubre de cada año, es una festividad nacional que conmemora este único sistema de escritura, y también lo celebran los estudiantes de coreano de todo el mundo.`,
    culturalNote:
      '세종대왕은 백성들이 쉽게 읽고 쓸 수 있도록 한글을 창제했습니다. 당시 한국은 한자를 사용했는데, 이는 일반 백성들이 배우기 매우 어려웠습니다. 한글은 과학적 원리에 따라 설계되어 단 며칠 만에 배울 수 있다고 알려져 있습니다.',
    culturalNoteEs:
      'El rey Sejong el Grande creó el hangul para que el pueblo pudiera leer y escribir fácilmente. En aquella época, Corea usaba caracteres chinos, que eran muy difíciles de aprender para la gente común. El hangul está diseñado según principios científicos y se dice que puede aprenderse en tan solo unos días.',
    sources: [{ title: '문화체육관광부 공식 발표', url: 'https://mcst.go.kr/1' }],
    publishedAt: '2026-04-03',
    likes: 95,
    status: 'published',
    comments: [],
  },
  {
    id: 'c19',
    title: '현대 한복, 파리 패션위크 무대 빛내다',
    titleEs: 'El hanbok moderno brilla en la Semana de la Moda de París',
    category: '문화',
    summary:
      '한국 신진 디자이너들의 현대적으로 재해석한 한복 컬렉션이 파리 패션위크에서 큰 호응을 받았습니다.',
    summaryEs:
      'Colecciones de hanbok contemporáneo de diseñadores emergentes coreanos reciben una gran acogida en la Semana de la Moda de París.',
    body: `한국의 신진 디자이너들이 전통 한복을 현대적으로 재해석한 컬렉션으로 파리 패션위크 무대에 올라 세계 패션계의 주목을 받았습니다.

실루엣과 색감은 전통 한복에서 영감을 받되, 현대적인 소재와 구조로 재탄생시킨 이번 컬렉션은 '케이-쿠튀르(K-Couture)'라는 새로운 장르를 개척하고 있다는 평가를 받았습니다.

패션 평론가들은 이번 쇼가 한국 전통 미학이 세계 최고 수준의 패션 무대와 대등하게 경쟁할 수 있음을 보여줬다고 평가했습니다.`,
    bodyEs: `Diseñadores emergentes coreanos subieron al escenario de la Semana de la Moda de París con colecciones que reinterpretan el hanbok tradicional de forma contemporánea, atrayendo la atención del mundo de la moda.

Las colecciones, que se inspiraron en la silueta y los colores del hanbok tradicional pero se renovaron con materiales y estructuras modernas, recibieron el reconocimiento de estar abriendo un nuevo género llamado 'K-Couture'.

Los críticos de moda valoraron que el espectáculo demostró que la estética tradicional coreana puede competir al mismo nivel en los escenarios de moda de mayor prestigio mundial.`,
    culturalNote:
      '한복은 한국의 전통 의복으로, 기본적으로 저고리(상의)와 치마(여성)/바지(남성)로 구성됩니다. 한복의 색감은 음양오행 사상에서 비롯된 전통 색채 체계를 사용합니다.',
    culturalNoteEs:
      'El hanbok es la vestimenta tradicional coreana, compuesta básicamente por el jeogori (chaqueta) y la falda (para mujeres) / pantalón (para hombres). Los colores del hanbok utilizan un sistema de colores tradicional derivado del pensamiento yin-yang y de los cinco elementos.',
    sources: [{ title: 'VOGUE Korea - 한복 파리 패션위크', url: 'https://vogue.co.kr/3' }],
    publishedAt: '2026-04-02',
    likes: 108,
    status: 'published',
    comments: [],
  },
  {
    id: 'c20',
    title: '한국 전통주, 미슐랭 레스토랑 페어링 메뉴 채택',
    titleEs: 'El licor tradicional coreano entra en los menús de maridaje de restaurantes Michelin',
    category: '문화',
    summary:
      '막걸리, 청주 등 한국 전통주가 미슐랭 스타 레스토랑의 공식 페어링 주류로 선정되며 세계화에 박차를 가하고 있습니다.',
    summaryEs:
      'Licores tradicionales coreanos como el makgeolli y el cheongju son seleccionados como bebidas oficiales de maridaje en restaurantes con estrella Michelin, acelerando su globalización.',
    body: `막걸리, 청주, 안동 소주 등 한국 전통주가 세계 유수 미슐랭 스타 레스토랑의 공식 페어링 메뉴에 포함되며 본격적인 글로벌 시장 진출을 알렸습니다.

뉴욕, 파리, 도쿄의 미슐랭 스타 셰프들은 한국 전통주의 독특한 풍미가 다양한 요리와 조화를 이루며, 기존 와인이나 사케와는 다른 새로운 경험을 선사한다고 평가했습니다.

한국 농림축산식품부는 전통주 글로벌 수출 지원을 강화하기 위한 로드맵을 발표하며 산업 육성에 나서고 있습니다.`,
    bodyEs: `Los licores tradicionales coreanos como el makgeolli, el cheongju y el soju de Andong han sido incluidos en los menús oficiales de maridaje de destacados restaurantes con estrella Michelin en todo el mundo, anunciando su plena entrada en el mercado global.

Los chefs con estrella Michelin de Nueva York, París y Tokio han valorado que el sabor único de los licores tradicionales coreanos armoniza con una gran variedad de platos, ofreciendo una nueva experiencia diferente a la del vino o el sake habitual.

El Ministerio de Agricultura, Alimentación y Asuntos Rurales de Corea está publicando una hoja de ruta para reforzar el apoyo a las exportaciones globales de licores tradicionales, fomentando así la industria.`,
    culturalNote:
      '막걸리는 쌀로 만든 한국 전통 탁주로, 도수가 낮고 새콤달콤한 맛이 특징입니다. 청주는 같은 재료로 만들지만 맑게 거른 술입니다. 안동 소주는 증류식 전통 소주로 45도 이상의 높은 도수가 특징입니다.',
    culturalNoteEs:
      'El makgeolli es un vino de arroz turbio tradicional coreano de baja graduación con un sabor agridulce característico. El cheongju se elabora con los mismos ingredientes pero se filtra hasta quedar claro. El soju de Andong es un soju tradicional destilado con alta graduación, generalmente superior a 45 grados.',
    sources: [{ title: '농림축산식품부 공식 발표', url: 'https://mafra.go.kr/1' }],
    publishedAt: '2026-04-01',
    likes: 61,
    status: 'published',
    comments: [],
  },
  {
    id: 'c21',
    title: '이강인, 라리가 이번 시즌 15골 달성',
    titleEs: 'Lee Kang-in alcanza los 15 goles esta temporada en LaLiga',
    category: '스포츠',
    summary:
      'PSG 소속 이강인이 라리가 역대 한국인 선수 단일 시즌 최다 골 기록에 도전하며 활약을 이어가고 있습니다.',
    summaryEs:
      'Lee Kang-in del PSG continúa su brillante actuación, desafiando el récord de más goles en una sola temporada de LaLiga para un jugador coreano.',
    body: `파리 생제르맹(PSG) 소속 이강인이 이번 시즌 라리가에서 15골을 기록하며 한국인 선수 단일 시즌 최다 골 기록 경신에 도전하고 있습니다.

창의적인 플레이메이킹과 강력한 슈팅을 겸비한 이강인은 PSG의 핵심 공격자로 자리를 굳혔으며, 발롱도르 후보로도 거론될 만큼 세계적인 수준의 활약을 펼치고 있습니다.

한국 축구 팬들은 손흥민에 이어 이강인이 한국 축구의 새로운 아이콘으로 자리잡기를 기대하고 있습니다.`,
    bodyEs: `Lee Kang-in del Paris Saint-Germain (PSG) lleva 15 goles esta temporada en LaLiga y desafía el récord de más goles en una sola temporada para un jugador coreano.

Lee Kang-in, que combina un creativísimo juego de creación con un poderoso disparo, se ha consolidado como el delantero clave del PSG y destaca a nivel mundial hasta el punto de mencionarse como candidato al Balón de Oro.

Los aficionados al fútbol coreano esperan que Lee Kang-in se convierta en el nuevo ícono del fútbol coreano, siguiendo los pasos de Son Heung-min.`,
    culturalNote:
      '이강인은 스페인 발렌시아 유스 아카데미 출신으로 일찍이 유럽 무대에서 두각을 나타냈습니다. 한국 축구는 2002 한일 월드컵 4강 진출 이후 꾸준히 글로벌 수준으로 성장해왔습니다.',
    culturalNoteEs:
      'Lee Kang-in es egresado de la academia juvenil del Valencia español y destacó en el escenario europeo desde muy joven. El fútbol coreano ha crecido constantemente a nivel global desde la semifinal de la Copa del Mundo Corea-Japón 2002.',
    sources: [{ title: '스포츠조선 - 이강인 15골', url: 'https://sportschosun.com/2' }],
    publishedAt: '2026-03-31',
    likes: 77,
    status: 'published',
    comments: [],
  },
  {
    id: 'c22',
    title: '김민재, 챔피언스리그 베스트 XI 선정',
    titleEs: 'Kim Min-jae es elegido en el Once Ideal de la Champions League',
    category: '스포츠',
    summary:
      '바이에른 뮌헨 소속 김민재가 UEFA 챔피언스리그 시즌 최우수 수비수로 선정되며 한국 축구의 자존심을 세웠습니다.',
    summaryEs:
      'Kim Min-jae del Bayern Múnich es elegido mejor defensor de la temporada en la UEFA Champions League, reivindicando el orgullo del fútbol coreano.',
    body: `바이에른 뮌헨 소속 한국인 수비수 김민재가 UEFA 챔피언스리그 시즌 베스트 XI에 선정되며 세계 최고의 수비수 중 한 명으로 공인받았습니다.

196cm의 장신에 빠른 발을 갖춘 김민재는 '괴물'이라는 별명에 걸맞게 유럽 최고 수준의 공격수들을 막아내며 뮌헨 수비의 핵심 축을 담당하고 있습니다.

이 기록은 아시아 수비수로서 챔피언스리그 베스트 XI에 선정된 최초 사례로 한국 축구 역사에 길이 남을 기록입니다.`,
    bodyEs: `Kim Min-jae, defensor coreano del Bayern Múnich, fue seleccionado en el Once Ideal de la temporada de la UEFA Champions League, siendo reconocido como uno de los mejores defensores del mundo.

Con 196 cm de altura y gran velocidad, Kim Min-jae, fiel a su apodo de 'monstruo', está cumpliendo un papel fundamental en la defensa del Munich bloqueando a los mejores delanteros europeos.

Este logro es el primer caso de un defensor asiático seleccionado en el Once Ideal de la Champions League, un hito que quedará para siempre en la historia del fútbol coreano.`,
    culturalNote:
      "김민재는 이탈리아 나폴리에서 세리에A 우승을 이끈 후 바이에른 뮌헨으로 이적했습니다. '괴물'이라는 별명은 그의 압도적인 신체 조건과 경기력에서 비롯된 것입니다.",
    culturalNoteEs:
      "Kim Min-jae fue traspasado al Bayern Múnich tras liderar al Nápoles hasta ganar la Serie A italiana. El apodo de 'monstruo' proviene de sus arrolladoras condiciones físicas y su rendimiento en el campo.",
    sources: [{ title: '스포츠동아 - 김민재 베스트 XI', url: 'https://donga.com/2' }],
    publishedAt: '2026-03-30',
    likes: 91,
    status: 'published',
    comments: [],
  },
  {
    id: 'c23',
    title: '한국 여자 배구, 2028 LA 올림픽 출전권 획득',
    titleEs:
      'La selección femenina de voleibol de Corea consigue el pasaporte para los Juegos Olímpicos de LA 2028',
    category: '스포츠',
    summary:
      '한국 여자 배구 국가대표팀이 아시아 예선에서 우승하며 2028 LA 올림픽 본선 진출을 확정했습니다.',
    summaryEs:
      'La selección nacional femenina de voleibol de Corea gana la clasificación asiática y confirma su participación en la fase final de los Juegos Olímpicos de Los Ángeles 2028.',
    body: `한국 여자 배구 국가대표팀이 2028 LA 올림픽 아시아 최종 예선을 1위로 통과하며 올림픽 본선 진출 티켓을 획득했습니다.

'배구 여왕' 김연경은 은퇴 후에도 후배 선수들의 멘토로 활동하며 한국 배구의 부흥을 이끌고 있으며, 이번 예선에서도 코치진의 일원으로 팀에 힘을 보탰습니다.

이번 올림픽 출전권 획득은 2021 도쿄 올림픽 4강 신화를 재현하려는 한국 여자 배구의 의지를 보여주는 것으로 평가됩니다.`,
    bodyEs: `La selección nacional femenina de voleibol de Corea obtuvo el billete para los Juegos Olímpicos al superar en primer lugar la clasificación asiática final para los JJOO de LA 2028.

La 'reina del voleibol' Kim Yeon-koung, incluso retirada, actúa como mentora de las jugadoras jóvenes liderando el resurgimiento del voleibol coreano, y también contribuyó al equipo en esta clasificación como miembro del cuerpo técnico.

La obtención de este billete olímpico se valora como una muestra de la determinación del voleibol femenino coreano por recrear el mito de la semifinal de los Juegos Olímpicos de Tokio 2021.`,
    culturalNote:
      '김연경은 한국 역대 최고의 배구 선수로 꼽히며, 2021 도쿄 올림픽에서 한국 여자 배구를 4강으로 이끌며 국민적인 사랑을 받았습니다. 배구는 한국에서 야구, 축구 다음으로 인기 있는 스포츠입니다.',
    culturalNoteEs:
      'Kim Yeon-koung está considerada la mejor jugadora de voleibol de la historia de Corea y fue muy querida por el país al llevar al voleibol femenino coreano a las semifinales en los Juegos Olímpicos de Tokio 2021. El voleibol es el tercer deporte más popular en Corea, después del béisbol y el fútbol.',
    sources: [{ title: '스포츠조선 - 여자 배구 올림픽 진출', url: 'https://sportschosun.com/3' }],
    publishedAt: '2026-03-29',
    likes: 84,
    status: 'published',
    comments: [],
  },
  {
    id: 'c24',
    title: '류현진, KBO 리그 복귀 후 10승 달성',
    titleEs: 'Ryu Hyun-jin logra 10 victorias tras su regreso a la KBO League',
    category: '스포츠',
    summary:
      'MLB에서 활약하다 KBO로 복귀한 류현진이 한화 이글스 소속으로 시즌 10승을 달성했습니다.',
    summaryEs:
      'Ryu Hyun-jin, que regresó a la KBO tras su paso por la MLB, logra 10 victorias en la temporada como miembro de los Hanwha Eagles.',
    body: `메이저리그에서 활약하다 한국 프로야구 KBO 리그로 복귀한 류현진이 한화 이글스 소속으로 시즌 10승을 달성하는 기염을 토했습니다.

토론토 블루제이스 등 메이저리그 팀에서 쌓은 경험을 바탕으로 류현진은 KBO 마운드에서도 여전히 뛰어난 제구력과 다양한 구종을 선보이며 상대 타자들을 압도하고 있습니다.

류현진의 복귀는 KBO 리그의 인기 상승에도 기여하고 있으며, 그의 등판일에는 경기장이 매진을 기록하는 경우가 많습니다.`,
    bodyEs: `Ryu Hyun-jin, que regresó a la Liga KBO de béisbol profesional de Corea tras su paso por las Grandes Ligas, consiguió 10 victorias en la temporada como miembro de los Hanwha Eagles.

Basándose en la experiencia acumulada en equipos de las Grandes Ligas como los Toronto Blue Jays, Ryu Hyun-jin sigue dominando a los bateadores rivales en el montículo de la KBO con un excelente control y una gran variedad de pitcheos.

El regreso de Ryu Hyun-jin también está contribuyendo al aumento de la popularidad de la Liga KBO, y los estadios suelen colgarse el cartel de lleno los días que él lanza.`,
    culturalNote:
      'KBO 리그는 한국 프로야구 리그로, 1982년에 창설되었습니다. 야구는 한국에서 가장 인기 있는 스포츠 중 하나이며, 응원 문화가 매우 독특합니다. 한국 야구장에서는 응원단과 함께 따라 부를 수 있는 응원가와 개인 응원 아이템이 필수입니다.',
    culturalNoteEs:
      'La Liga KBO es la liga de béisbol profesional de Corea, fundada en 1982. El béisbol es uno de los deportes más populares de Corea, con una cultura de animación muy peculiar. En los estadios de béisbol coreanos son imprescindibles las canciones de animación que se pueden cantar junto con las animadoras y los artículos de apoyo personalizados.',
    sources: [{ title: '스포츠조선 - 류현진 10승', url: 'https://sportschosun.com/4' }],
    publishedAt: '2026-03-28',
    likes: 63,
    status: 'published',
    comments: [],
  },
  {
    id: 'c25',
    title: '김치찌개, 세계 최고 음식 10위 안에 선정',
    titleEs: 'El kimchi jjigae entra en el top 10 de los mejores platos del mundo',
    category: '음식',
    summary:
      "세계적인 음식 매거진 'Taste Atlas'가 김치찌개를 세계 최고 음식 10위 안에 선정했습니다.",
    summaryEs:
      "La prestigiosa revista gastronómica 'Taste Atlas' selecciona el kimchi jjigae entre los 10 mejores platos del mundo.",
    body: `세계 최대 음식 데이터베이스 사이트 'Taste Atlas'가 발표한 '세계 최고 음식 100선'에서 한국의 김치찌개가 10위 안에 진입하는 쾌거를 이뤘습니다.

김치찌개는 발효된 김치와 돼지고기, 두부 등을 함께 끓인 한국의 국민 찌개로, 깊은 감칠맛과 칼칼한 매운맛의 조화가 세계 음식 전문가들에게 높은 평가를 받았습니다.

최근 K-푸드의 글로벌 인기 상승과 함께 해외에서도 김치찌개를 맛볼 수 있는 한식당이 급증하고 있습니다.`,
    bodyEs: `El kimchi jjigae de Corea logró la hazaña de entrar en el top 10 de los '100 mejores platos del mundo' publicados por 'Taste Atlas', el mayor sitio de base de datos gastronómica del mundo.

El kimchi jjigae es el guiso nacional de Corea elaborado con kimchi fermentado, cerdo, tofu y otros ingredientes, y la armonía entre su profundo sabor umami y su picante ardiente recibió una alta valoración por parte de los expertos gastronómicos mundiales.

Con el creciente auge global de la K-food, el número de restaurantes coreanos en el extranjero donde se puede degustar el kimchi jjigae está aumentando rápidamente.`,
    culturalNote:
      "김치는 한국의 대표적인 발효 식품으로, 배추, 무, 고추가루, 마늘 등을 섞어 발효시킨 것입니다. 유네스코 인류무형문화유산에 등재된 '김장 문화'는 한국 가정에서 겨울 김치를 함께 담그는 공동체 활동입니다.",
    culturalNoteEs:
      "El kimchi es el alimento fermentado más representativo de Corea, elaborado con la fermentación de col china, rábano, pasta de guindilla, ajo y otros ingredientes. La 'cultura del kimjang', inscrita en el Patrimonio Cultural Inmaterial de la Humanidad de la UNESCO, es una actividad comunitaria en la que las familias coreanas preparan juntas el kimchi de invierno.",
    sources: [{ title: 'Taste Atlas 공식 발표', url: 'https://tasteatlas.com/1' }],
    publishedAt: '2026-03-27',
    likes: 127,
    status: 'published',
    comments: [
      {
        id: 'cm25',
        userId: 'u7',
        userName: 'Isabella R.',
        body: '¡Me encanta el kimchi jjigae! Es mi plato coreano favorito.',
        createdAt: '2026-03-27',
      },
    ],
  },
  {
    id: 'c26',
    title: '떡볶이, 글로벌 프랜차이즈로 세계 200개국 진출',
    titleEs: 'El tteokbokki se expande como franquicia global a 200 países',
    category: '음식',
    summary:
      '한국의 국민 분식 떡볶이가 글로벌 프랜차이즈 형태로 세계 200개국에 진출하며 K-푸드의 위상을 높이고 있습니다.',
    summaryEs:
      'El tteokbokki, el snack nacional de Corea, eleva el estatus de la K-food al expandirse a 200 países del mundo en forma de franquicia global.',
    body: `한국의 국민 간식 떡볶이가 글로벌 프랜차이즈로 성장하며 세계 200개국 이상에 매장을 보유하게 되었습니다.

고추장 양념의 쫄깃한 가래떡을 주재료로 하는 떡볶이는 한국을 찾는 외국인들이 반드시 맛봐야 할 음식으로 꼽히며, 최근에는 현지화된 다양한 맛으로 해외 소비자들의 입맛을 사로잡고 있습니다.

특히 멕시코, 브라질 등 중남미 국가에서도 K-콘텐츠 팬들을 중심으로 떡볶이 열풍이 거세게 불고 있어 현지 매장 수가 급격히 증가하고 있습니다.`,
    bodyEs: `El tteokbokki, el snack favorito de Corea, ha crecido hasta convertirse en una franquicia global con presencia en más de 200 países del mundo.

El tteokbokki, cuyo ingrediente principal son las pastillas de arroz elásticas condimentadas con pasta de guindilla roja, es considerado un plato imprescindible para los extranjeros que visitan Corea, y recientemente está conquistando el paladar de los consumidores extranjeros con una gran variedad de sabores localizados.

En particular, en países latinoamericanos como México y Brasil, la fiebre por el tteokbokki se está intensificando entre los fans del contenido K, con un rápido aumento en el número de tiendas locales.`,
    culturalNote:
      "떡볶이는 원래 궁중 요리에서 유래했으며, 간장 양념의 고급 요리였습니다. 현재 우리가 먹는 고추장 떡볶이는 1950년대에 등장한 비교적 새로운 형태입니다. '분식점'은 떡볶이, 순대, 김밥 등을 파는 한국의 대표적인 간식 전문점입니다.",
    culturalNoteEs:
      "El tteokbokki se originó en la cocina de la corte real y era un plato refinado con salsa de soja. El tteokbokki con pasta de guindilla roja que comemos hoy en día es una forma relativamente nueva que apareció en la década de 1950. La 'bunsikjeom' es la tienda de snacks más representativa de Corea, que vende tteokbokki, sundae y gimbap, entre otros.",
    sources: [{ title: '한국농수산식품유통공사 - K-푸드 글로벌', url: 'https://atfis.or.kr/1' }],
    publishedAt: '2026-03-26',
    likes: 143,
    status: 'published',
    comments: [],
  },
  {
    id: 'c27',
    title: '미슐랭 서울 가이드, 별 3개 레스토랑 역대 최다',
    titleEs: 'La Guía Michelin Seúl alcanza el máximo histórico de restaurantes con 3 estrellas',
    category: '음식',
    summary:
      '2026 미슐랭 가이드 서울 편에서 별 3개 레스토랑이 역대 최다를 기록하며 서울이 세계 미식 수도로 자리매김했습니다.',
    summaryEs:
      'La edición 2026 de la Guía Michelin Seúl alcanza un máximo histórico de restaurantes con 3 estrellas, consolidando Seúl como capital gastronómica mundial.',
    body: `2026년판 미슐랭 가이드 서울이 발표되며, 별 3개 레스토랑 수가 역대 최다를 기록했습니다.

한식의 정수를 보여주는 파인다이닝부터 퓨전 한식, 셰프 오마카세까지 다양한 장르의 레스토랑들이 별을 획득하며, 서울이 세계 최고 수준의 식문화 도시 중 하나임을 다시 한번 증명했습니다.

특히 젊은 한국 셰프들이 전통 발효 식재료와 현대적인 조리 기법을 결합한 '뉴 코리안 퀴진'이 국제적으로 주목받고 있습니다.`,
    bodyEs: `Se publicó la edición 2026 de la Guía Michelin Seúl, alcanzando un número récord de restaurantes con 3 estrellas.

Desde los restaurantes de alta cocina que exhiben la esencia de la gastronomía coreana hasta la cocina coreana de fusión y los omakase de chef, restaurantes de géneros muy diversos obtuvieron estrellas, demostrando una vez más que Seúl es una de las mejores ciudades culinarias del mundo.

En particular, la 'Nueva Cocina Coreana' de los jóvenes chefs coreanos, que combina ingredientes fermentados tradicionales con técnicas culinarias modernas, está atrayendo atención internacional.`,
    culturalNote:
      '한식에서 발효는 매우 중요한 개념입니다. 김치, 된장, 간장, 고추장 등의 발효 식품은 한식의 핵심 재료로, 수백 년의 역사를 가지고 있습니다. 한국의 장류(된장, 간장, 고추장)는 미소나 간장과 유사하지만 독특한 풍미를 가집니다.',
    culturalNoteEs:
      'La fermentación es un concepto muy importante en la gastronomía coreana. Los alimentos fermentados como el kimchi, el doenjang, la salsa de soja y el gochujang son ingredientes clave de la cocina coreana, con cientos de años de historia. Los fermentados coreanos (doenjang, salsa de soja, gochujang) son similares al miso o la salsa de soja, pero tienen un sabor único.',
    sources: [{ title: '미슐랭 가이드 서울 공식 발표', url: 'https://guide.michelin.com/kr/1' }],
    publishedAt: '2026-03-25',
    likes: 72,
    status: 'published',
    comments: [],
  },
  {
    id: 'c28',
    title: 'T1 페이커, e스포츠 올해의 선수상 7회 수상',
    titleEs: 'Faker de T1 gana por 7ª vez el Premio al Jugador del Año de los Esports',
    category: '뉴스',
    summary:
      'T1의 미드라이너 이상혁(페이커)이 e스포츠 올해의 선수상을 7번째로 수상하며 전설적인 기록을 이어가고 있습니다.',
    summaryEs:
      'El carry central de T1, Lee Sang-hyeok (Faker), gana por séptima vez el Premio al Jugador del Año de los Esports, continuando su legendario historial.',
    body: `T1의 미드라이너 이상혁(Faker)이 게임 어워드 2025에서 e스포츠 올해의 선수상을 7번째로 수상하며 '역대 최고의 e스포츠 선수(GOAT)'로서의 위치를 공고히 했습니다.

2013년 프로 데뷔 이후 10년이 넘는 기간 동안 최고의 자리를 유지하고 있는 페이커는 리그 오브 레전드 월드 챔피언십(롤드컵)에서 5회 우승이라는 전무후무한 기록을 보유하고 있습니다.

한국 e스포츠는 세계 최초로 대학교에서 e스포츠 전공을 개설하고, 군 복무 문제에서도 e스포츠 선수를 체육 요원으로 인정받게 하는 등 제도적 기반을 갖추며 세계를 선도하고 있습니다.`,
    bodyEs: `El carry central de T1, Lee Sang-hyeok (Faker), ganó por séptima vez el Premio al Jugador del Año en The Game Awards 2025, consolidando su posición como 'el mejor jugador de esports de la historia (GOAT)'.

Faker, que ha mantenido su posición en la cima durante más de 10 años desde su debut profesional en 2013, ostenta el récord sin precedentes de 5 victorias en el Campeonato Mundial de League of Legends (Worlds).

Los esports coreanos lideran el mundo con una base institucional que incluye la primera licenciatura universitaria en esports del mundo y el reconocimiento de los jugadores de esports como personal deportivo en el servicio militar.`,
    culturalNote:
      'e스포츠는 한국에서 독보적인 위상을 가집니다. PC방 문화의 발전과 함께 성장한 한국 e스포츠는 1990년대 말부터 TV 방송과 프로리그 체계를 갖추며 현재의 글로벌 e스포츠 산업의 초석을 닦았습니다.',
    culturalNoteEs:
      'Los esports gozan de un estatus sin parangón en Corea. Los esports coreanos, que crecieron junto al desarrollo de la cultura de los cibercafés (PC방), sentaron las bases de la industria global de los esports actual al establecer desde finales de los años 90 un sistema de emisión televisiva y ligas profesionales.',
    sources: [{ title: '인벤 - 페이커 올해의 선수', url: 'https://inven.co.kr/2' }],
    publishedAt: '2026-03-24',
    likes: 189,
    status: 'published',
    comments: [
      {
        id: 'cm28',
        userId: 'u8',
        userName: 'Diego V.',
        body: '¡Faker es un dios del League of Legends! Merece todos los premios.',
        createdAt: '2026-03-24',
      },
    ],
  },
  {
    id: 'c29',
    title: '봉준호 신작, 칸 황금종려상 수상',
    titleEs: 'La nueva película de Bong Joon-ho gana la Palma de Oro en Cannes',
    category: '문화',
    summary:
      '봉준호 감독이 신작 SF 스릴러로 칸 국제영화제 황금종려상을 수상하며 한국 영화의 위상을 다시 한번 드높였습니다.',
    summaryEs:
      'El director Bong Joon-ho eleva de nuevo el prestigio del cine coreano al ganar la Palma de Oro del Festival de Cannes con su nuevo thriller de ciencia ficción.',
    body: `봉준호 감독의 신작 SF 스릴러 영화가 제79회 칸 국제영화제에서 황금종려상을 수상하며 한국 영화가 또 한 번 세계 최고의 영예를 안았습니다.

2019년 '기생충'으로 칸 황금종려상, 아카데미 작품상을 석권한 바 있는 봉준호 감독은 이번 수상으로 칸 황금종려상 2회 수상이라는 전무후무한 기록을 달성했습니다.

봉준호 감독은 수상 소감에서 "영화는 국경이 없다. 한국의 이야기가 전 세계 관객에게 닿을 수 있다는 것을 다시 한번 느꼈다"고 밝혔습니다.`,
    bodyEs: `La nueva película de ciencia ficción y suspense del director Bong Joon-ho ganó la Palma de Oro en el 79º Festival de Cannes, logrando que el cine coreano recibiera de nuevo el mayor honor mundial.

El director Bong Joon-ho, que en 2019 ganó la Palma de Oro en Cannes y el Premio de la Academia a Mejor Película con 'Parásitos', logra con este premio el récord sin precedentes de dos Palmas de Oro en Cannes.

En su discurso de agradecimiento, el director Bong Joon-ho declaró: "El cine no tiene fronteras. He vuelto a sentir que las historias de Corea pueden llegar a audiencias de todo el mundo".`,
    culturalNote:
      "봉준호 감독의 '기생충'은 2019년 칸 황금종려상, 2020년 아카데미 작품상을 수상하며 한국 영화 역사상 최고의 성과를 거뒀습니다. 이는 비영어권 영화가 아카데미 작품상을 수상한 최초의 사례였습니다.",
    culturalNoteEs:
      "La película 'Parásitos' del director Bong Joon-ho logró el mayor éxito en la historia del cine coreano al ganar la Palma de Oro de Cannes en 2019 y el Premio de la Academia a Mejor Película en 2020. Fue el primer caso de una película no inglesa en ganar el Oscar a Mejor Película.",
    sources: [{ title: '씨네21 - 봉준호 칸 황금종려상', url: 'https://cine21.com/5' }],
    publishedAt: '2026-03-23',
    likes: 176,
    status: 'published',
    comments: [],
  },
  {
    id: 'c30',
    title: '한국 게임, 글로벌 모바일 시장 점유율 1위 탈환',
    titleEs:
      'Los juegos coreanos reconquistan el primer lugar en el mercado global de juegos móviles',
    category: '뉴스',
    summary:
      '넥슨, 넷마블, 크래프톤 등 한국 게임사들이 글로벌 모바일 게임 매출 상위권을 싹쓸이하며 1위를 탈환했습니다.',
    summaryEs:
      'Empresas coreanas de videojuegos como Nexon, Netmarble y Krafton barren los primeros puestos de ingresos en el mercado global de juegos móviles y reconquistan el número 1.',
    body: `글로벌 모바일 게임 시장 조사 기관 앱애니(AppAnnie) 보고서에 따르면 한국 게임사들이 2026년 1분기 글로벌 모바일 게임 매출 상위 10위 안에 6개 타이틀을 올리며 1위 국가로 탈환했습니다.

특히 크래프톤의 'PUBG Mobile'과 넥슨의 'Blue Archive'가 중남미와 동남아시아 시장에서 폭발적인 성장세를 기록하며 이번 성과를 이끌었습니다.

전문가들은 K-POP과 K-드라마의 인기로 한국 문화에 친숙해진 글로벌 유저들이 한국 게임에도 자연스럽게 접근하게 되는 선순환 효과가 나타나고 있다고 분석합니다.`,
    bodyEs: `Según un informe de la consultora global de mercado de juegos móviles AppAnnie, las empresas de juegos coreanas recuperaron el primer puesto entre los países con 6 títulos en el top 10 de ingresos globales del mercado de juegos móviles en el primer trimestre de 2026.

En particular, 'PUBG Mobile' de Krafton y 'Blue Archive' de Nexon lideraron este logro al registrar un crecimiento explosivo en los mercados de América Latina y el Sudeste Asiático.

Los expertos analizan que se está produciendo un efecto de círculo virtuoso en el que los usuarios globales familiarizados con la cultura coreana gracias a la popularidad del K-POP y los K-dramas se acercan también de forma natural a los juegos coreanos.`,
    culturalNote:
      '한국은 세계에서 인터넷 속도가 가장 빠른 나라 중 하나로, 이는 온라인 게임과 e스포츠 산업의 발전에 큰 기여를 했습니다. PC방(피씨방)은 한국 게임 문화의 중심으로, 최신 PC와 빠른 인터넷을 제공하는 게임 카페입니다.',
    culturalNoteEs:
      'Corea es uno de los países con la velocidad de internet más rápida del mundo, lo que ha contribuido enormemente al desarrollo de los juegos online y la industria de los esports. El PC방 (PC Bang) es el centro de la cultura del juego coreana, un cibercafé que ofrece los PC más modernos e internet ultrarrápido.',
    sources: [{ title: 'AppAnnie 글로벌 게임 리포트', url: 'https://data.ai/1' }],
    publishedAt: '2026-03-22',
    likes: 58,
    status: 'published',
    comments: [],
  },
  {
    id: 'c31',
    title: '한국 웹툰 플랫폼, 미국 만화 시장 점유율 35% 달성',
    titleEs: 'Las plataformas de webtoon coreanas alcanzan el 35% del mercado de cómics en EE. UU.',
    category: '뉴스',
    summary:
      '네이버 웹툰과 카카오 픽코마 등 한국 웹툰 플랫폼이 미국 디지털 만화 시장의 35%를 차지하게 되었습니다.',
    summaryEs:
      'Las plataformas de webtoon coreanas como Naver Webtoon y Kakao Piccoma alcanzan el 35% del mercado de cómics digitales en Estados Unidos.',
    body: `한국의 웹툰 플랫폼 네이버 웹툰과 카카오 픽코마가 미국 디지털 만화 시장에서 합산 35%의 점유율을 기록하며 미국 전통 만화 출판사들을 위협하고 있습니다.

세로 스크롤과 컬러 웹툰이라는 새로운 포맷은 기존 왼쪽에서 오른쪽으로 읽는 미국 만화와 위에서 아래로 읽는 일본 만화(망가)와 다른 독특한 독서 경험을 제공하며 북미 독자들을 사로잡고 있습니다.

또한 '이태원 클라쓰', '나 혼자만 레벨업' 등 웹툰 원작 드라마와 애니메이션이 글로벌 히트를 치며 원작 웹툰의 인기도 함께 높아지는 효과가 나타나고 있습니다.`,
    bodyEs: `Las plataformas de webtoon coreanas Naver Webtoon y Kakao Piccoma amenazan a las editoriales de cómics estadounidenses tradicionales al registrar conjuntamente una cuota del 35% en el mercado de cómics digitales de Estados Unidos.

El nuevo formato del scroll vertical y los webtoons en color está cautivando a los lectores norteamericanos al ofrecer una experiencia de lectura única, diferente a los cómics americanos de lectura de izquierda a derecha y el manga japonés de lectura de arriba a abajo.

Además, los dramas y animaciones basados en webtoons como 'Itaewon Class' y 'Solo Leveling' se han convertido en éxitos globales, con el efecto de aumentar también la popularidad del webtoon original.`,
    culturalNote:
      '웹툰은 인터넷(web)과 만화(cartoon)의 합성어로, 스마트폰 화면에 최적화된 세로 스크롤 만화 형식입니다. 네이버와 카카오는 한국 최대의 IT 플랫폼 기업으로, 각각 네이버 웹툰과 카카오 픽코마를 운영하며 글로벌 시장을 선도하고 있습니다.',
    culturalNoteEs:
      'El webtoon es una palabra compuesta de web y cartoon (web+cartoon), un formato de cómic de scroll vertical optimizado para la pantalla del smartphone. Naver y Kakao son las mayores empresas de plataformas IT de Corea, y lideran el mercado global operando Naver Webtoon y Kakao Piccoma respectivamente.',
    sources: [{ title: '조선일보 - K-웹툰 미국 시장', url: 'https://chosun.com/3' }],
    publishedAt: '2026-03-21',
    likes: 49,
    status: 'published',
    comments: [],
  },
  {
    id: 'c32',
    title: 'K-뷰티, 미국 드럭스토어 매출 1위 브랜드 탄생',
    titleEs: 'K-Beauty: nace la marca número 1 en ventas en las droguerías de EE. UU.',
    category: '뉴스',
    summary:
      "한국 뷰티 브랜드 '아누아'가 미국 CVS 드럭스토어 스킨케어 매출 1위를 달성하며 K-뷰티의 새 역사를 썼습니다.",
    summaryEs:
      "La marca de belleza coreana 'Anua' escribe una nueva historia del K-Beauty al alcanzar el primer puesto en ventas de cuidado de la piel en las droguerías CVS de EE. UU.",
    body: `한국 뷰티 브랜드 '아누아(Anua)'가 미국 최대 드럭스토어 체인 CVS에서 스킨케어 카테고리 매출 1위를 달성했습니다.

아누아의 '어성초 닦토 패드'와 '퍼스트 세럼' 시리즈는 SNS에서 입소문을 타며 미국 밀레니얼·Z세대 사이에서 폭발적인 인기를 끌었습니다.

합리적인 가격에 탁월한 효능이라는 K-뷰티의 강점이 다시 한번 빛을 발했으며, 전문가들은 K-뷰티가 럭셔리 브랜드도 아닌 중저가 가격대에서 글로벌 시장을 잠식하고 있다는 점을 주목하고 있습니다.`,
    bodyEs: `La marca de belleza coreana 'Anua' alcanzó el primer puesto de ventas en la categoría de cuidado de la piel en CVS, la mayor cadena de droguerías de Estados Unidos.

La serie 'Heartleaf Pore Control Cleansing Pad' y el 'First Serum' de Anua se convirtieron en un éxito explosivo entre los millennials y la generación Z estadounidense tras correr la voz en las redes sociales.

El punto fuerte del K-Beauty de ofrecer una eficacia excelente a un precio razonable volvió a brillar, y los expertos destacan que el K-Beauty está conquistando el mercado global en el segmento de precio medio-bajo, no en el de lujo.`,
    culturalNote:
      "K-뷰티는 세계 뷰티 시장에서 '기능성 성분'과 '스킨케어 루틴'이라는 새로운 트렌드를 주도했습니다. 한국의 '10단계 스킨케어 루틴'은 전 세계적으로 알려진 K-뷰티의 대표적인 문화입니다.",
    culturalNoteEs:
      "El K-Beauty lideró nuevas tendencias en el mercado mundial de la belleza: los 'ingredientes funcionales' y la 'rutina de cuidado de la piel'. La 'rutina de skincare de 10 pasos' de Corea es la cultura más representativa del K-Beauty conocida en todo el mundo.",
    sources: [{ title: '뷰티뉴스 - 아누아 CVS 1위', url: 'https://beautynews.kr/2' }],
    publishedAt: '2026-03-20',
    likes: 93,
    status: 'published',
    comments: [],
  },
  {
    id: 'c33',
    title: '정국, 솔로 데뷔 앨범으로 그래미 후보 올라',
    titleEs: 'Jung Kook recibe una nominación al Grammy con su álbum debut en solitario',
    category: 'K-POP',
    summary:
      "BTS 정국이 솔로 앨범으로 그래미 어워드 '최우수 팝 보컬 앨범' 부문에 후보로 이름을 올렸습니다.",
    summaryEs:
      "Jung Kook de BTS recibe una nominación al Grammy en la categoría 'Mejor Álbum Vocal Pop' con su álbum en solitario.",
    body: `BTS의 정국(전정국)이 솔로 데뷔 앨범 'GOLDEN'으로 그래미 어워드 '최우수 팝 보컬 앨범' 부문 후보에 올랐습니다.

이번 후보 지명은 한국 남자 솔로 아티스트로서는 최초의 그래미 본상 후보 기록으로, K-POP이 미국 주류 음악 시장에서 더 이상 특별한 존재가 아닌 대등한 경쟁자임을 보여주는 사례로 평가됩니다.

정국은 BTS 군 입대 기간 동안 발매한 솔로 앨범으로 빌보드 앨범 차트 1위를 달성한 바 있으며, 이번 그래미 후보 지명은 그의 음악적 성취를 다시 한번 인정받는 계기가 되었습니다.`,
    bodyEs: `Jung Kook (Jeon Jungkook) de BTS recibió una nominación al Grammy en la categoría 'Mejor Álbum Vocal Pop' con su álbum debut en solitario 'GOLDEN'.

Esta nominación es el primer caso de un artista masculino solista coreano nominado a los principales premios Grammy, y se valora como un ejemplo de que el K-POP ya no es una entidad especial en el mercado musical mainstream de Estados Unidos, sino un competidor a la par.

Jung Kook alcanzó el puesto número 1 en el ranking de álbumes de Billboard con su álbum en solitario lanzado durante el periodo de servicio militar de BTS, y esta nominación al Grammy se convirtió en una ocasión para volver a reconocer sus logros musicales.`,
    culturalNote:
      '한국 남성 아이돌은 만 18세~28세 사이에 군 복무를 이행해야 합니다. BTS 멤버들도 순차적으로 군 복무를 마치고 있으며, 이는 한국 사회의 병역 의무 문화를 보여줍니다.',
    culturalNoteEs:
      'Los idols masculinos coreanos deben realizar el servicio militar entre los 18 y los 28 años. Los miembros de BTS también están completando su servicio militar de forma escalonada, lo que refleja la cultura de obligación al servicio militar en la sociedad coreana.',
    sources: [{ title: '빌보드 - 정국 그래미 후보', url: 'https://billboard.com/1' }],
    publishedAt: '2026-03-19',
    likes: 167,
    status: 'published',
    comments: [
      {
        id: 'cm33',
        userId: 'u9',
        userName: 'Valentina C.',
        body: '¡Jung Kook se merece ese Grammy! GOLDEN es un álbum increíble.',
        createdAt: '2026-03-19',
      },
    ],
  },
  {
    id: 'c34',
    title: '힘쎈여자 강남순 시즌2, 시청률 20% 돌파',
    titleEs: "'Chica fuerte Nam Soon' temporada 2 supera el 20% de audiencia",
    category: '드라마',
    summary:
      "MBC 드라마 '힘쎈여자 강남순'의 두 번째 시즌이 전국 시청률 20%를 돌파하며 대박 행진을 이어가고 있습니다.",
    summaryEs:
      "La segunda temporada del drama de MBC 'Chica fuerte Nam Soon' continúa su racha de éxito al superar el 20% de audiencia nacional.",
    body: `MBC 드라마 '힘쎈여자 강남순' 시즌2가 방영 중 전국 시청률 20%를 돌파하며 대형 화제작으로 등극했습니다.

이유미, 옹성우, 박지환이 주연을 맡은 이번 시즌은 시즌1의 '강남순'에 이어 새로운 초강력 여성 주인공 '강남순의 딸' 이야기를 담고 있습니다.

한국에서 시청률 20%는 매우 드문 기록으로, 최근 OTT 플랫폼의 발달로 지상파 시청률이 전반적으로 낮아진 현 상황에서 이 기록은 더욱 의미가 깊습니다.`,
    bodyEs: `La temporada 2 del drama de MBC 'Chica fuerte Nam Soon' se convirtió en un gran fenómeno mediático al superar el 20% de audiencia nacional durante su emisión.

Esta temporada, protagonizada por Lee Yoo-mi, Ong Seong-wu y Park Ji-hwan, sigue la historia de 'la hija de Nam Soon', una nueva protagonista femenina de fuerza extraordinaria, en continuación del personaje de 'Nam Soon' de la temporada 1.

Un índice de audiencia del 20% es un récord muy raro en Corea, y este logro es aún más significativo en la situación actual donde los índices de audiencia de las cadenas de emisión convencionales han bajado en general debido al auge de las plataformas OTT.`,
    culturalNote:
      "한국의 TV 시청률 조사 기관은 닐슨코리아로, 전국 기준과 수도권 기준으로 나눠 발표합니다. '지상파'는 KBS, MBC, SBS 등 무선으로 방송하는 공중파 채널을 말하며, 최근 넷플릭스, 웨이브, 티빙 등 OTT의 성장으로 영향력이 줄었습니다.",
    culturalNoteEs:
      "La empresa de medición de audiencia televisiva en Corea es Nielsen Korea, que publica los datos en base nacional y base metropolitana de la capital. 'Terrestrial' se refiere a los canales de radiodifusión convencional sin cable como KBS, MBC y SBS, cuya influencia ha disminuido recientemente con el crecimiento de OTTs como Netflix, Wavve y Tving.",
    sources: [{ title: 'MBC 공식 발표', url: 'https://mbc.co.kr/1' }],
    publishedAt: '2026-03-18',
    likes: 102,
    status: 'published',
    comments: [],
  },
  {
    id: 'c35',
    title: 'BTS 완전체 컴백, 글로벌 팬덤 들썩',
    titleEs: 'El regreso completo de BTS sacude a los fandoms mundiales',
    category: 'K-POP',
    summary:
      '전원 전역 후 완전체로 돌아온 BTS가 컴백을 공식 선언하며 전 세계 ARMY를 흥분의 도가니로 몰아넣었습니다.',
    summaryEs:
      'BTS, reunidos como grupo completo tras el licenciamiento de todos sus miembros, anuncia oficialmente su regreso, sumiendo al ARMY mundial en el frenesí.',
    body: `BTS 전원이 군 복무를 마치고 완전체로 돌아와 그룹 활동 재개를 공식 선언했습니다.

빅히트 뮤직은 공식 SNS를 통해 2026년 하반기 BTS 완전체 컴백 앨범 발매와 월드투어 계획을 함께 발표했습니다.

서울 상암 월드컵경기장 공연을 시작으로 북미, 남미, 유럽, 아시아를 아우르는 대규모 월드투어가 예정되어 있으며, 이미 수십만 장의 예매 신청이 쏟아지고 있습니다.`,
    bodyEs: `BTS anunció oficialmente la reanudación de sus actividades grupales con todos los miembros reunidos tras completar su servicio militar.

Big Hit Music anunció junto a través de sus redes sociales oficiales el lanzamiento de un álbum de regreso como grupo completo en la segunda mitad de 2026 y los planes de una gira mundial.

Comenzando por un concierto en el Estadio del Mundo de Sangam en Seúl, está programada una gran gira mundial que abarca Norteamérica, Latinoamérica, Europa y Asia, y ya se están recibiendo cientos de miles de solicitudes de reserva.`,
    culturalNote:
      "한국 아이돌 그룹은 군 복무 등으로 인한 활동 공백 후 '완전체 컴백'이라는 개념으로 팬들과 재회합니다. BTS의 ARMY는 세계 최대 규모의 팬덤 중 하나로, 공식 팬클럽 회원만 수백만 명에 달합니다.",
    culturalNoteEs:
      "Los grupos de idols coreanos se reencuentran con sus fans con el concepto del 'regreso completo' tras un parón en actividades por el servicio militar u otras razones. El ARMY de BTS es uno de los mayores fandoms del mundo, con solo los miembros del fanclub oficial alcanzando varios millones.",
    sources: [{ title: '빅히트 뮤직 공식 발표', url: 'https://bighitmusic.com/1' }],
    publishedAt: '2026-04-23',
    likes: 312,
    status: 'published',
    comments: [
      {
        id: 'cm35a',
        userId: 'u10',
        userName: 'Laura M.',
        body: '¡POR FIN! Llevaba años esperando este momento. 💜',
        createdAt: '2026-04-23',
      },
      {
        id: 'cm35b',
        userId: 'u11',
        userName: 'Camila F.',
        body: 'Voy a necesitar conseguir entradas sí o sí!',
        createdAt: '2026-04-23',
      },
    ],
  },
];

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Maria González',
  email: 'maria@example.com',
  avatarUrl: '',
  likedContentIds: ['c1', 'c3'],
};
