# frozen_string_literal: true

namespace :load do
  task :defaults do
    set :git_sha, -> { `git rev-parse HEAD`.chomp }

    set :git_sha_short, -> { `git rev-parse --short HEAD`.chomp }

    set :git_author, -> { `git log -1 --pretty=format:'%an'`.chomp }

    set :git_commit_format, -> { "- %s (%h by %aN)" }

    set :git_changelog, lambda {
      parents = `git show -s --pretty=%ph --quiet HEAD`.chomp.split(" ")

      next `git log -1 --pretty=format:"#{fetch(:git_commit_format)}"` if parents.size == 1

      prev = parents.first
      `git log --oneline --no-merges --pretty=format:"#{fetch(:git_commit_format)}" #{prev}..HEAD`.chomp
    }

    set :submodules, {}
  end
end

namespace :git do
  namespace :submodules do
    task :configure do
      on roles(:all) do
        temp_index_file_path = release_path.join("TEMP_INDEX_#{fetch(:release_timestamp)}")

        with fetch(:git_environmental_variables).merge(
          "GIT_DIR" => repo_path.to_s,
          "GIT_WORK_TREE" => release_path.to_s,
          "GIT_INDEX_FILE" => temp_index_file_path.to_s
        ) do
          within release_path do
            fetch(:submodules).each do |path, url|
              execute(:git, "submodule", "set-url", path, url)
            end
          end
        end
      end
    end
  end
end

before :"git:submodules:create_release", :"git:submodules:configure"
