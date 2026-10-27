function doGet() {
  return HtmlService.createTemplateFromFile("index")
    .evaluate()
    .setTitle("YouTube 深海発掘機 - Deep Search Engine")
    .addMetaTag("viewport", "width=device-width, initial-scale=1")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function searchNicheVideosFromUI(params) {
  const apiKey =
    PropertiesService.getScriptProperties().getProperty("YOUTUBE_API_KEY") ||
    PropertiesService.getScriptProperties().getProperty("GEMINI_API_KEY");

  if (!apiKey) {
    throw new Error("APIキーがスクリプトプロパティに設定されていません！");
  }

  // ワードプールからランダムに1つ選出
  let candidates = [
    "哲学",
    "思想",
    "考察",
    "雑記",
    "未解決",
    "検証",
    "独り言",
    "記録",
    "アーカイブ",
    "散歩",
    "研究",
    "エッセイ",
    "構造",
    "意味",
    "記憶",
    "エントロピー",
    "個人製作",
    "ラジオ",
    "街歩き",
    "夜",
  ];
  if (params.keywordPool && params.keywordPool.trim() !== "") {
    candidates = params.keywordPool
      .split(/[,,\n]/)
      .map((s) => s.trim())
      .filter(Boolean);
  }

  const selectedKeyword =
    candidates[Math.floor(Math.random() * candidates.length)] || "哲学";

  const negativeKeywords = params.useNegative
    ? " -公式 -MV -PV -切り抜き -ニュース -アニメ -まとめ -解説 -PR -ch -チャンネル登録"
    : "";
  const fullQuery = selectedKeyword + negativeKeywords;

  let publishedAfter = "";
  let publishedBefore = "";

  if (params.useTimeTravel) {
    const minYear = 2013;
    const maxYear = 2024;
    const randomYear =
      Math.floor(Math.random() * (maxYear - minYear + 1)) + minYear;
    const randomMonth = Math.floor(Math.random() * 12);

    const startDate = new Date(randomYear, randomMonth, 1);
    const endDate = new Date(randomYear, randomMonth + 3, 0);

    publishedAfter = startDate.toISOString();
    publishedBefore = endDate.toISOString();
  }

  const maxViewCount = params.maxViews || 5000;
  const minMinutes = params.minMinutes || 10;
  const targetFetchCount = 100;

  // --- YouTube API 検索 ---
  let videoIdSet = new Set();
  let nextPageToken = "";

  for (let i = 0; i < 2; i++) {
    let searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${encodeURIComponent(fullQuery)}&maxResults=50&key=${apiKey}`;
    if (publishedAfter && publishedBefore) {
      searchUrl += `&publishedAfter=${publishedAfter}&publishedBefore=${publishedBefore}`;
    }
    if (nextPageToken) {
      searchUrl += `&pageToken=${nextPageToken}`;
    }

    const searchResponse = UrlFetchApp.fetch(searchUrl, {
      muteHttpExceptions: true,
    });
    const searchData = JSON.parse(searchResponse.getContentText());

    if (!searchData.items || searchData.items.length === 0) break;

    searchData.items.forEach((item) => {
      if (item.id && item.id.videoId) videoIdSet.add(item.id.videoId);
    });

    nextPageToken = searchData.nextPageToken;
    if (!nextPageToken || videoIdSet.size >= targetFetchCount) break;
  }

  const videoIds = Array.from(videoIdSet).slice(0, targetFetchCount);
  if (videoIds.length === 0) {
    return { selectedKeyword, results: [] };
  }

  // --- 詳細情報取得 ---
  let allDetailItems = [];
  for (let i = 0; i < videoIds.length; i += 50) {
    const chunkIds = videoIds.slice(i, i + 50).join(",");
    const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${chunkIds}&key=${apiKey}`;
    const detailsResponse = UrlFetchApp.fetch(detailsUrl, {
      muteHttpExceptions: true,
    });
    const detailsData = JSON.parse(detailsResponse.getContentText());

    if (detailsData.items)
      allDetailItems = allDetailItems.concat(detailsData.items);
  }

  // --- フィルタリング（サムネイル取得付き） ---
  let results = [];
  allDetailItems.forEach((item) => {
    const stats = item.statistics;
    const content = item.contentDetails;
    const snippet = item.snippet;

    const viewCount = stats.viewCount ? parseInt(stats.viewCount, 10) : 0;
    const durationSeconds = parseISO8601Duration(content.duration);
    const durationMinutes = durationSeconds / 60;

    if (viewCount <= maxViewCount && durationMinutes >= minMinutes) {
      // サムネイルURL（高画質がなければ中画質/標準）
      const thumbnail = snippet.thumbnails.medium
        ? snippet.thumbnails.medium.url
        : snippet.thumbnails.default.url;

      results.push({
        id: item.id,
        title: snippet.title,
        channel: snippet.channelTitle,
        publishedAt: snippet.publishedAt.split("T")[0],
        views: viewCount,
        duration: Math.floor(durationMinutes),
        thumbnail: thumbnail,
        url: `https://www.youtube.com/watch?v=${item.id}`,
      });
    }
  });

  return { selectedKeyword, results };
}

function parseISO8601Duration(durationStr) {
  const match = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  return (
    parseInt(match[1] || 0, 10) * 3600 +
    parseInt(match[2] || 0, 10) * 60 +
    parseInt(match[3] || 0, 10)
  );
}
