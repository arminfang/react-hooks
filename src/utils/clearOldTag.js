const { execSync } = require("child_process");
const moment = require("moment");

// 获取所有标签信息
function getAllTags() {
  const cmd = `git for-each-ref --format='%(refname:short),%(creatordate:iso8601)' refs/tags/`;
  const result = execSync(cmd)
    .toString()
    .trim()
    .split("\n")
    .filter((line) => line)
    .map((line) => {
      const [tag, date] = line.split(",");
      return { date: new Date(date), tag };
    });
  console.log("result", result);
  return result;
}

// 删除本地和远程标签
function deleteTag(tag) {
  try {
    // 删除本地标签
    execSync(`git tag -d ${tag}`);
    console.log(`Deleted local tag: ${tag}`);

    // 删除远程标签
    execSync(`git push origin :refs/tags/${tag}`);
    console.log(`Deleted remote tag: ${tag}`);
  } catch (error) {
    console.error(`Error deleting tag ${tag}:`, error.message);
  }
}

// 主函数
function cleanOldTags() {
  const sixMonthsAgo = moment().subtract(6, "months");
  const tags = getAllTags();

  const oldTags = tags.filter(({ date }) =>
    moment(date).isBefore(sixMonthsAgo)
  );
  console.log("oldTags", oldTags);

  console.log(`Found ${oldTags.length} tags older than 6 months`);

  oldTags.forEach(({ tag }) => {
    // deleteTag(tag);
  });
}

// 执行清理
cleanOldTags();
