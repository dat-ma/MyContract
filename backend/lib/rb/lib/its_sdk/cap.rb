# frozen_string_literal: true

require "capistrano/file-permissions"

require "capistrano/scm/git-with-submodules"
install_plugin Capistrano::SCM::Git::WithSubmodules

require "active_support/all"

module ItsSdk
  module Cap
    class Error < StandardError; end
  end
end
