import { reactionsColor, reactionsMap } from '@root/constants';

export class PostUtils {
  static sumAllReactions(reactions) {
    if (!reactions) return 0;
    return Object.values(reactions).reduce((sum, value) => sum + value, 0);
  }

  static getPostReactions(reactions) {
    if (!reactions) return [];

    const postReactions = Object.keys(reactions).map((reaction) => {
      return {
        reaction: reaction,
        value: reactions[reaction],
      };
    });

    const filteredReactions = postReactions.filter(
      (reaction) => reaction.value > 0
    );

    filteredReactions.sort((a, b) => b.value - a.value);

    return filteredReactions.slice(0, 3).map((reaction) => {
      return reactionsMap[reaction.reaction];
    });
  }

  static getReactionFormattedDetails(reactionType) {
    // (default)
    if (!reactionType) {
      return {
        type: 'like',
        text: 'Like',
        color: '#969eb3',
      };
    }

    return {
      type: reactionType,
      text: reactionType.charAt(0).toUpperCase() + reactionType.slice(1), // Capitalize (like -> Like)
      color: reactionsColor[reactionType],
    };
  }

  static getFormattedReactionTabs(reactions) {
    const tabs = [{ type: 'All', count: reactions.length }];

    const reactionCounts = reactions.reduce((acc, reaction) => {
      const type = reaction.type;
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    Object.keys(reactionCounts).forEach((type) => {
      tabs.push({
        type: type, // 'like', 'love'...
        count: reactionCounts[type],
        image: reactionsMap[type], 
      });
    });

    return tabs;
  }
}
