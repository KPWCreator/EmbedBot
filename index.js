/**
 * 必要なモジュールを読み込む
 */
const { Client, GatewayIntentBits, Events, EmbedBuilder } = require('discord.js');
const dotenv = require('dotenv');

/**
 * 環境変数を読み込む（TOKENやAPIKeyなど）
 */
dotenv.config();

/**
 * DiscordのBotクライアントを作成
 */
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

/**
 * DiscordのBotにログインする
 * process.env.TOKENで環境変数（.env）に保存したBotのTOKENを読み込む
 */
client.login(process.env.TOKEN);

/**
 * DiscordBotが起動したときのイベント
 */
client.once(Events.ClientReady, async () => {
    /**
     * スラッシュコマンドを登録するサーバーを取得
     */
    const guild = await client.guilds.fetch(process.env.GUILD);
    if (guild) {
        /**
         * スラッシュコマンドの内容を設定
         */
        await guild.commands.create({
            name: 'embed',
            description: 'Embedを呼び出す'
        });
    }

    /**
     * 起動完了のメッセージ
     */
    console.log(`${client.user?.username ?? `Unknown`}が起動しました!`);
});

/**
 * コマンドが実行されたときのイベント
 */
client.on(Events.InteractionCreate, async (interaction) => {
    /**
     * スラッシュコマンドじゃないコマンドは処理をしない
     */
    if (!interaction.isChatInputCommand()) {
        return;
    }

    /**
     * 実行されたスラッシュコマンドのコマンド名を取得
     */
    const { commandName } = interaction;

    /**
     * 実行されたスラッシュコマンドがembed（ClientReadyで自分が設定した名前）であれば
     */
    if (commandName === 'embed') {
        /**
         * Embedの箱を作る
         */
        const embed = new EmbedBuilder();
        
        /**
         * Embedにタイトルを設定
         */
        embed.setTitle("プログラミング講座");

        /**
         * Embedに説明（タイトルの下）を設定
         */
        embed.setDescription("プログラミング講座で作成したEmbed");

        /**
         * Embedの左のバーの色を設定
         * 10進数のカラーコードの場合はそのまま記載
         * 16進数のカラーコードの場合は最初に0xをつける
         */
        embed.setColor(0x00ff00)

        /**
         * Embedに送信者を設定
         * interaction.member.displayNameはコマンド実行者の名前
         * interaction.member.displayAvatarURL()はアイコンの画像のURL
         */
        embed.setAuthor({ name: `${interaction.member.displayName}`, iconURL: `${interaction.member.displayAvatarURL()}`});

        /**
         * Embedに表示する内容の設定
         */
        embed.addFields(
            { name: "名前", value: interaction.member.displayName, inline: true },
            { name: "加入日", value: new Date(interaction.member.joinedTimestamp).toLocaleString(), inline: true }
        );

        /**
         * Embedにフッターを設定
         */
        embed.setFooter({ text: "このbotはhina_mikanによって作成されました．"});

        /**
         * Embedにコマンド実行日時を表示
         */
        embed.setTimestamp();

        /**
         * 作成したEmbedを送信
         */
        await interaction.reply({ embeds: [embed] });
    }
})