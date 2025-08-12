require 'rails_helper'

RSpec.describe "Api::TestController", type: :request do
  let(:user) { create(:user) }
  let(:headers) do
    {
      'Content-Type' => 'application/json',
      'Accept' => 'application/json'
    }
  end

  describe "POST /api/test/ping" do
    context "when user is authenticated" do
      before do
        # For request specs, we need to sign in using the session
        sign_in_user(user)
      end

      context "with valid 'ping' message" do
        let(:valid_params) { { message: "ping" } }

        it "returns pong response" do
          post "/api/test/ping", params: valid_params.to_json, headers: headers

          expect(response).to have_http_status(:ok)
          expect(response.content_type).to match(a_string_including("application/json"))

          json_response = JSON.parse(response.body)
          expect(json_response["response"]).to eq("pong")
        end

        it "returns JSON content type" do
          post "/api/test/ping", params: valid_params.to_json, headers: headers

          expect(response.content_type).to match(a_string_including("application/json"))
        end
      end

      context "with invalid message" do
        let(:invalid_params) { { message: "hello" } }

        it "returns error response" do
          post "/api/test/ping", params: invalid_params.to_json, headers: headers

          expect(response).to have_http_status(:bad_request)

          json_response = JSON.parse(response.body)
          expect(json_response["error"]).to eq("Expected 'ping', received 'hello'")
        end
      end

      context "with missing message parameter" do
        let(:empty_params) { {} }

        it "returns error response for nil message" do
          post "/api/test/ping", params: empty_params.to_json, headers: headers

          expect(response).to have_http_status(:bad_request)

          json_response = JSON.parse(response.body)
          expect(json_response["error"]).to eq("Expected 'ping', received ''")
        end
      end

      context "with empty message" do
        let(:empty_message_params) { { message: "" } }

        it "returns error response" do
          post "/api/test/ping", params: empty_message_params.to_json, headers: headers

          expect(response).to have_http_status(:bad_request)

          json_response = JSON.parse(response.body)
          expect(json_response["error"]).to eq("Expected 'ping', received ''")
        end
      end
    end

    context "when user is not authenticated" do
      let(:valid_params) { { message: "ping" } }

      it "returns unauthorized status" do
        post "/api/test/ping", params: valid_params.to_json, headers: headers

        expect(response).to have_http_status(:unauthorized)
      end

      it "does not process the request" do
        post "/api/test/ping", params: valid_params.to_json, headers: headers

        expect(response.body).not_to include("pong")
      end
    end
  end

  describe "HTTP method restrictions" do
    before do
      sign_in_user(user)
    end

    it "only accepts POST requests to /api/test/ping" do
      # GET should return 404
      get "/api/test/ping"
      expect(response).to have_http_status(:not_found)

      # PUT should return 404
      put "/api/test/ping"
      expect(response).to have_http_status(:not_found)

      # DELETE should return 404
      delete "/api/test/ping"
      expect(response).to have_http_status(:not_found)

      # PATCH should return 404
      patch "/api/test/ping"
      expect(response).to have_http_status(:not_found)
    end
  end

  describe "Authentication edge cases" do
    it "requires valid session for API access" do
      # Create user but don't sign in
      user = create(:user)

      post "/api/test/ping",
           params: { message: "ping" }.to_json,
           headers: headers

      expect(response).to have_http_status(:unauthorized)
    end

    it "maintains authentication across requests" do
      # Sign in
      sign_in_user(user)

      # First API call
      post "/api/test/ping",
           params: { message: "ping" }.to_json,
           headers: headers

      expect(response).to have_http_status(:ok)

      # Second API call should still work
      post "/api/test/ping",
           params: { message: "ping" }.to_json,
           headers: headers

      expect(response).to have_http_status(:ok)
    end
  end

  describe "Parameter handling" do
    before do
      sign_in_user(user)
    end

    it "handles nil message parameter" do
      post "/api/test/ping",
           params: { message: nil }.to_json,
           headers: headers

      expect(response).to have_http_status(:bad_request)
      json_response = JSON.parse(response.body)
      expect(json_response["error"]).to eq("Expected 'ping', received ''")
    end

    it "ignores extra parameters" do
      post "/api/test/ping",
           params: { message: "ping", extra: "ignored" }.to_json,
           headers: headers

      expect(response).to have_http_status(:ok)
      json_response = JSON.parse(response.body)
      expect(json_response["response"]).to eq("pong")
    end

    it "handles whitespace in message" do
      post "/api/test/ping",
           params: { message: " ping " }.to_json,
           headers: headers

      expect(response).to have_http_status(:bad_request)
      json_response = JSON.parse(response.body)
      expect(json_response["error"]).to eq("Expected 'ping', received ' ping '")
    end
  end
end
