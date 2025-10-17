namespace :db do
  desc "Prepare database: run migrations if needed and seed if not already seeded"
  task prepare: :environment do
    puts "🔍 Checking database status..."

    # Check if database exists
    begin
      ActiveRecord::Base.connection
    rescue ActiveRecord::NoDatabaseError
      puts "📝 Database doesn't exist. Creating..."
      Rake::Task["db:create"].invoke
    end

    # Run migrations (this is safe to run multiple times)
    begin
      # Check if we have any application tables
      table_count = ActiveRecord::Base.connection.tables.reject { |table|
        table == 'schema_migrations' || table == 'ar_internal_metadata'
      }.count

      if table_count == 0
        puts "🔄 Setting up database schema..."
      else
        puts "🔄 Checking for pending migrations..."
      end

      Rake::Task["db:migrate"].invoke
    rescue StandardError => e
      puts "⚠️ Error during migration: #{e.message}"
      raise
    end

    # Check if seeding is needed by looking for the default user
    if User.exists?(email_address: "user@example.com")
      puts "✅ Database already seeded (default user exists)"
    else
      puts "🌱 Seeding database..."
      Rake::Task["db:seed"].invoke
      puts "✅ Database seeded successfully"
    end

    puts "🎉 Database preparation complete!"
  end
end
