module ItsSdk
  module Cap
    module Ext
      module Telegram
        LINE_BREAK = "&#10;"

        module_function

        def notify(group_id:, token:, message:, columns:, topic_id: nil)
          require "httparty"

          HTTParty.post(
            "https://api.telegram.org/bot#{token}/sendMessage",
            body: {
              chat_id: group_id,
              text: to_telegram_message(message, columns),
              parse_mode: "HTML",
              disable_web_page_preview: true,
              reply_to_message_id: topic_id
            }
          )
        end

        # @param [String] text
        def parse_columns(columns_text)
          columns = columns_text.split("|W|").map(&:strip).drop(1)

          columns.each.with_index.each_with_object([]) do |column_with_index, acc|
            column, index = column_with_index
            acc.push({ content: "", title: "", variant: "" }) if (index % 3).zero?

            current_column = acc.last

            case index % 3
            when 0
              current_column[:variant] = column
            when 1
              current_column[:title] = column
            when 2
              current_column[:content] = column
            end
          end
        end

        def html_escape(columns_text)
          escaped = columns_text.gsub(%r{<html-escape>((.|\n|\r\n)*?)</html-escape>}) do |_match|
            ERB::Util.html_escape_once(::Regexp.last_match(1)).gsub(/[\r\n]/, LINE_BREAK)
          end

          escaped.strip.chomp(LINE_BREAK).delete_prefix(LINE_BREAK).strip
        end

        def format_columns(columns)
          columns.map do |column|
            content = ERB::Util.html_escape_once(column[:content])

            if column[:variant] == "full"
              "▪️ <b>#{column[:title]}</b>#{LINE_BREAK}#{content}"
            else
              "▪️ <b>#{column[:title]}</b>: #{content}"
            end
          end
        end

        def to_telegram_message(message_text, columns_text)
          columns = parse_columns(html_escape(columns_text))
          formatted_columns = format_columns(columns)

          [message_text, LINE_BREAK, formatted_columns.join(LINE_BREAK)].join
        end
      end
    end
  end
end
