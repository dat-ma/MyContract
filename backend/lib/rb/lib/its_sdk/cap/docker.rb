# frozen_string_literal: true

require_relative "helper"

ItsSdk::Cap::Helper.load_plugin "shared", "git", "notify", "docker"

before :"deploy:check:linked_files", :"deploy:create:linked_files"
after :"deploy:symlink:release", :"deploy:docker:build"
before :"deploy:docker:build", :"deploy:set_permissions:chmod"
before :"deploy:docker:build", :"deploy:docker:network:create"
after :"deploy:docker:build", :"deploy:docker:update"
after :"deploy:docker:update", :"deploy:docker:cleanup"
